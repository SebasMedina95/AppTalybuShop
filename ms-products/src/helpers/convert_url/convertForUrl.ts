
export function optimizeForSEO(text: string): string {

    // Mapeo de caracteres con tilde y la ñ
    const accentMap: { [key: string]: string } = {
      'á': 'a', 
      'é': 'e', 
      'í': 'i', 
      'ó': 'o', 
      'ú': 'u',
      'Á': 'a', 
      'É': 'e', 
      'Í': 'i', 
      'Ó': 'o', 
      'Ú': 'u',
      'ñ': 'n', 
      'Ñ': 'n'
    };
  
    // Paso 1: Convertir a minúsculas
    let seoText = text.toLowerCase();
  
    // Paso 2: Reemplazar tildes y ñ
    seoText = seoText.split('').map(char => accentMap[char] || char).join('');
  
    // Paso 3: Reemplazar espacios por guiones bajos
    seoText = seoText.replace(/\s+/g, '_');
  
    // Retornar el resultado final
    return seoText;
  }
