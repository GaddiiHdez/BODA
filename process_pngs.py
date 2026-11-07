from PIL import Image
import os

def isolate_white_to_transparent_png(input_path, output_path, tolerance=242):
    """
    Convierte el fondo blanco/casi blanco de una ilustración de acuarela en transparencia PNG suave.
    Aplica canal alfa suave para evitar bordes dentados y preservar la acuarela translúcida.
    """
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    new_data = []
    for item in datas:
        r, g, b, a = item
        # Promedio de luminosidad
        brightness = (r + g + b) / 3.0
        
        # Si es blanco o casi blanco (fondo de papel)
        if brightness >= tolerance and min(r, g, b) > 235:
            # Transparencia total o desvanecimiento muy suave
            factor = (brightness - tolerance) / (255 - tolerance) if tolerance < 255 else 1.0
            alpha = int(255 * (1.0 - factor * 0.95))
            if brightness > 250:
                alpha = 0
            new_data.append((r, g, b, alpha))
        elif brightness >= tolerance - 25 and min(r, g, b) > 215:
            # Zona de transición suave para que los bordes de la acuarela se difuminen perfectamente
            diff = brightness - (tolerance - 25)
            factor = diff / 25.0
            alpha = int(255 * (1.0 - factor * 0.5))
            new_data.append((r, g, b, min(a, alpha)))
        else:
            new_data.append((r, g, b, a))

    img.putdata(new_data)
    
    # Recortar márgenes transparentes vacíos automáticamente (autocrop)
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(output_path, "PNG")
    print(f"Generado con éxito: {output_path} (Tamaño: {img.size})")

assets_dir = r"c:\Users\gaddi\Documents\Boda\assets"
os.makedirs(assets_dir, exist_ok=True)

files_to_convert = [
    ("header_crown.jpg", "header_crown.png", 240),
    ("bottom_garland.jpg", "bottom_garland.png", 238),
    ("corner_bouquet.jpg", "corner_bouquet.png", 240),
    ("rose.jpg", "rose.png", 235),
    ("olive_branch.jpg", "olive_branch.png", 240),
    ("eucalyptus.jpg", "eucalyptus.png", 240)
]

for src, dst, tol in files_to_convert:
    src_path = os.path.join(assets_dir, src)
    dst_path = os.path.join(assets_dir, dst)
    if os.path.exists(src_path):
        isolate_white_to_transparent_png(src_path, dst_path, tolerance=tol)
