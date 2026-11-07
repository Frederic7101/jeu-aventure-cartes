# Détoure les personnages en pied et écrit images\pied_*.png (fond transparent).
# Usage : powershell -File detourer.ps1   (à relancer seulement si les images sources changent)
# - Lacote, Bruno, Sacha : planche « Trio d'enquêteurs… » sur fond blanc, fond retiré par remplissage depuis les bords.
# - Montclair : image en pied « Élégant gentleman au foulard doré », sur fond blanc, même traitement.
#   (La méthode Contour, détourage selon un tracé manuel, reste disponible pour une image sans fond uni.)
[Console]::OutputEncoding = [Text.Encoding]::UTF8
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System; using System.Collections.Generic; using System.Drawing; using System.Drawing.Imaging; using System.Drawing.Drawing2D; using System.Runtime.InteropServices;
public static class Detoure {
  static int[] Lire(Bitmap b) { var d = b.LockBits(new Rectangle(0,0,b.Width,b.Height), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb); var a = new int[b.Width*b.Height]; Marshal.Copy(d.Scan0, a, 0, a.Length); b.UnlockBits(d); return a; }
  static Bitmap Ecrire(int[] a, int w, int h) { var b = new Bitmap(w, h, PixelFormat.Format32bppArgb); var d = b.LockBits(new Rectangle(0,0,w,h), ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb); Marshal.Copy(a, 0, d.Scan0, a.Length); b.UnlockBits(d); return b; }
  static Bitmap Recadre(Bitmap src, Rectangle r) { var b = new Bitmap(r.Width, r.Height, PixelFormat.Format32bppArgb); using (var g = Graphics.FromImage(b)) g.DrawImage(src, new Rectangle(0,0,r.Width,r.Height), r, GraphicsUnit.Pixel); return b; }
  static bool Blanc(int p, int seuil, int ecart) { int r=(p>>16)&255, g=(p>>8)&255, bl=p&255; int mx=Math.Max(r,Math.Max(g,bl)), mn=Math.Min(r,Math.Min(g,bl)); return mn>=seuil && mx-mn<=ecart; }
  // Écrit le résultat rogné sur les pixels visibles, mis à la hauteur demandée.
  static void Sortie(int[] a, int w, int h, string dst, int hauteur) {
    int x0=w, y0=h, x1=-1, y1=-1;
    for (int y=0;y<h;y++) for (int x=0;x<w;x++) if (((a[y*w+x]>>24)&255) > 8) { if(x<x0)x0=x; if(x>x1)x1=x; if(y<y0)y0=y; if(y>y1)y1=y; }
    using (var b = Ecrire(a, w, h)) using (var c = Recadre(b, new Rectangle(x0, y0, x1-x0+1, y1-y0+1))) {
      int ow = (int)Math.Round(c.Width * (double)hauteur / c.Height);
      using (var o = new Bitmap(ow, hauteur, PixelFormat.Format32bppArgb)) {
        using (var g = Graphics.FromImage(o)) { g.InterpolationMode = InterpolationMode.HighQualityBicubic; g.PixelOffsetMode = PixelOffsetMode.HighQuality; g.DrawImage(c, new Rectangle(0,0,ow,hauteur)); }
        o.Save(dst, ImageFormat.Png);
      }
    }
  }
  public static void FondBlanc(string src, string dst, int rx, int ry, int rw, int rh, int hauteur) { FondBlanc(src, dst, rx, ry, rw, rh, hauteur, null); }
  // cheveux : zone (x0,y0,x1,y1 dans l'image source) où le blanc pris entre les mèches devient transparent,
  // suivie de zones d'exclusion (x0,y0,x1,y1, autant que nécessaire) qui protègent le visage ; seuls les pixels peu colorés sont touchés.
  public static void FondBlanc(string src, string dst, int rx, int ry, int rw, int rh, int hauteur, int[] cheveux) {
    using (var s = new Bitmap(src)) using (var b = Recadre(s, new Rectangle(rx, ry, rw, rh))) {
      int w=b.Width, h=b.Height; var a = Lire(b); var fond = new bool[w*h]; var q = new Queue<int>();
      for (int x=0;x<w;x++) { foreach (int y in new[]{0,h-1}) { int i=y*w+x; if(!fond[i] && Blanc(a[i],226,24)){fond[i]=true;q.Enqueue(i);} } }
      for (int y=0;y<h;y++) { foreach (int x in new[]{0,w-1}) { int i=y*w+x; if(!fond[i] && Blanc(a[i],226,24)){fond[i]=true;q.Enqueue(i);} } }
      while (q.Count>0) { int i=q.Dequeue(), x=i%w, y=i/w;
        if (x>0) Pousse(a,fond,q,i-1,226,24); if (x<w-1) Pousse(a,fond,q,i+1,226,24); if (y>0) Pousse(a,fond,q,i-w,226,24); if (y<h-1) Pousse(a,fond,q,i+w,226,24); }
      // trous fermés (entre un bras et le corps) : grandes plages d'un blanc presque pur
      var vu = new bool[w*h];
      for (int i0=0;i0<w*h;i0++) { if (fond[i0] || vu[i0] || !Blanc(a[i0],244,10)) continue;
        var comp = new List<int>(); var p = new Queue<int>(); p.Enqueue(i0); vu[i0]=true;
        while (p.Count>0) { int i=p.Dequeue(); comp.Add(i); int x=i%w, y=i/w;
          foreach (int j in new[]{ x>0?i-1:-1, x<w-1?i+1:-1, y>0?i-w:-1, y<h-1?i+w:-1 }) if (j>=0 && !vu[j] && !fond[j] && Blanc(a[j],244,10)) { vu[j]=true; p.Enqueue(j); } }
        if (comp.Count >= 300) foreach (int i in comp) fond[i]=true; }
      for (int i=0;i<w*h;i++) if (fond[i]) a[i]=0;
      // bord adouci : un pixel clair contre le fond devient semi-transparent
      var b2 = (int[])a.Clone();
      for (int y=1;y<h-1;y++) for (int x=1;x<w-1;x++) { int i=y*w+x; if (fond[i]) continue;
        if (!(fond[i-1]||fond[i+1]||fond[i-w]||fond[i+w])) continue;
        int r=(a[i]>>16)&255, g=(a[i]>>8)&255, bl=a[i]&255; int lum=(r+g+bl)/3;
        int al = Math.Max(60, Math.Min(255, (255-lum)*255/70)); b2[i] = (al<<24) | (a[i] & 0xFFFFFF); }
      if (cheveux != null) {
        int zx0=cheveux[0]-rx, zy0=cheveux[1]-ry, zx1=cheveux[2]-rx, zy1=cheveux[3]-ry;
        for (int y=Math.Max(0,zy0); y<Math.Min(h,zy1); y++) for (int x=Math.Max(0,zx0); x<Math.Min(w,zx1); x++) {
          bool exclu = false;
          for (int k=4; k+3<cheveux.Length; k+=4) if (x>=cheveux[k]-rx && x<cheveux[k+2]-rx && y>=cheveux[k+1]-ry && y<cheveux[k+3]-ry) { exclu = true; break; }
          if (exclu) continue;
          int i=y*w+x, p=b2[i], al0=(p>>24)&255; if (al0==0) continue;
          int r=(p>>16)&255, g=(p>>8)&255, bl=p&255; int mn=Math.Min(r,Math.Min(g,bl)), mx=Math.Max(r,Math.Max(g,bl));
          if (mx-mn > 40) continue;
          double af = (255-mn)/75.0; if (af >= 1) continue;
          if (af < 0.03) { b2[i]=0; continue; }
          Func<int,int> c = v => Math.Max(0, Math.Min(255, (int)Math.Round(255 - (255-v)/af)));
          int na = (int)Math.Round(al0*af);
          b2[i] = (na<<24) | (c(r)<<16) | (c(g)<<8) | c(bl);
        }
      }
      Sortie(b2, w, h, dst, hauteur);
    }
  }
  static void Pousse(int[] a, bool[] f, Queue<int> q, int j, int s, int e) { if (!f[j] && Blanc(a[j], s, e)) { f[j]=true; q.Enqueue(j); } }
  public static void Contour(string src, string dst, int[] pts, int hauteur) {
    using (var s = new Bitmap(src)) {
      int w=s.Width, h=s.Height; var a = Lire(s);
      using (var m = new Bitmap(w, h, PixelFormat.Format32bppArgb)) {
        using (var g = Graphics.FromImage(m)) { g.Clear(Color.Black); g.SmoothingMode = SmoothingMode.AntiAlias; var pp = new PointF[pts.Length/2]; for (int k=0;k<pp.Length;k++) pp[k]=new PointF(pts[2*k], pts[2*k+1]); g.FillPolygon(Brushes.White, pp); }
        var mk = Lire(m);
        for (int i=0;i<w*h;i++) { int al=(mk[i]>>16)&255; a[i] = (al<<24) | (a[i] & 0xFFFFFF); }
      }
      Sortie(a, w, h, dst, hauteur);
    }
  }
}
'@
$Im = Join-Path $PSScriptRoot 'images'; $S = Join-Path $Im 'sources'
$trio = (Get-ChildItem -LiteralPath $S -Filter 'Trio*.png' | Select-Object -First 1).FullName
[Detoure]::FondBlanc($trio, (Join-Path $Im 'pied_lacote.png'), 95, 0, 360, 1024, 640, [int[]](170, 10, 345, 105, 205, 10, 300, 105))
[Detoure]::FondBlanc($trio, (Join-Path $Im 'pied_bruno.png'), 505, 0, 480, 1024, 700)
[Detoure]::FondBlanc($trio, (Join-Path $Im 'pied_sacha.png'), 1070, 0, 380, 1024, 700, [int[]](1150, 0, 1345, 215, 1210, 60, 1303, 128))
# Montclair en pied, sur fond blanc (le décor de la rédaction n'a plus de Montclair peint : le jeu le pose lui-même).
$mcp = (Get-ChildItem -LiteralPath $S -Filter '*gentleman au foulard*.png' | Select-Object -First 1).FullName
[Detoure]::FondBlanc($mcp, (Join-Path $Im 'pied_montclair.png'), 150, 0, 660, 1536, 1300, [int[]](395, 0, 610, 230, 440, 70, 565, 230))
Get-ChildItem -LiteralPath $Im -Filter 'pied_*.png' | ForEach-Object { $i = [Drawing.Image]::FromFile($_.FullName); Write-Host ("{0} : {1} x {2}, {3} Ko" -f $_.Name, $i.Width, $i.Height, [math]::Round($_.Length / 1024)); $i.Dispose() }
