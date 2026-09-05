# Manuel: Guardián del Álgebra 📐🎮

Videojuego educativo interactivo desarrollado con **Node.js** y **Vanilla JavaScript**, alineado con el currículum oficial del **Ministerio de Educación de Chile (MINEDUC)** para **Matemáticas de 1° Medio** (*Álgebra y Funciones*).

El protagonista es **Manuel**, un estudiante de 1° Medio que se queda dormido preparando su prueba de álgebra y despierta en el Reino de Matelandia. Para regresar a su liceo y obtener un 7.0, deberá dominar los productos notables, la factorización y el equilibrio de las ecuaciones lineales.

---

## 📚 Cobertura Curricular (MINEDUC Chile - 1° Medio)

1. **OA 3 - Productos Notables**:
   - **Cuadrado de Binomio**: \((a \pm b)^2 = a^2 \pm 2ab + b^2\)
   - **Suma por Diferencia**: \((x + y)(x - y) = x^2 - y^2\) (con demostración geométrica de corte de áreas)
   - **Binomio con Término Común**: \((x + a)(x + b) = x^2 + (a+b)x + ab\)
2. **OA 2 - Factorización Elemental**:
   - Factor Común Monomio: \(kx + ky = k(x + y)\)
   - Trinomio Ordenado: \(x^2 + px + q = (x + a)(x + b)\)
   - Diferencia de Cuadrados: \(x^2 - a^2 = (x + a)(x - a)\)
3. **OA 4 - Ecuaciones Lineales de Primer Grado**:
   - Ecuaciones lineales con coeficientes enteros: \(ax + b = cx + d\)
   - Ecuaciones con paréntesis y propiedad distributiva: \(a(x + b) = c\)
   - Ecuaciones fraccionarias simples: \(\frac{x+a}{b} = c\)
   - **Simulador Interactivo de la Balanza Algebraica**: Visualización física de igualdad y equilibrio.

---

## 🕹️ Modos de Juego

- **⚔️ La Odisea de Manuel (Modo Historia)**:
  - **Mundo 1**: El Bosque de los Términos Semejantes
  - **Mundo 2**: Las Ruinas de los Productos Notables
  - **Mundo 3**: La Caverna de la Factorización
  - **Mundo 4**: El Abismo de la Gran Balanza
  - **Mundo 5**: La Batalla Final contra el Dr. Monomio
- **🧪 Laboratorio de Práctica Libre**:
  - 9 módulos de entrenamiento infinito con soluciones paso a paso detalladas y pistas contextuales.
- **⏱️ Desafío Contrarreloj (Simulador SIMCE 1° Medio)**:
  - 10 ejercicios con temporizador de 3 minutos.
  - Generación de **Diploma de Honor descargable (PNG)** personalizado en Canvas.
- **📖 Cuaderno de Fórmulas**:
  - Resumen oficial de fórmulas, propiedades y ejemplos prácticos.
- **🏆 Salón de la Fama**:
  - Tabla de clasificación y puntajes máximos.

---

## 🔊 Efectos y Audio

- Sintetizador 100% nativo mediante **Web Audio API** (sin depender de archivos MP3 externos).
- Efectos de sonido retro estilo 8-bit (acierto, error, ataque, fanfarria de victoria y música chiptune opcional).

---

## 🚀 Instalación y Ejecución Local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/AiesTreiA/matepaes.git
   cd matepaes
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Ejecutar pruebas unitarias:
   ```bash
   npm test
   ```

4. Iniciar el servidor local:
   ```bash
   npm start
   ```
   Abrir en el navegador: [http://localhost:3000](http://localhost:3000)

---

## ☁️ Despliegue en Vercel

El proyecto incluye configuración nativa para **Vercel Serverless**:
- [`vercel.json`](vercel.json): Enrutamiento de peticiones API y entrega CDN de recursos estáticos en `public/`.
- [`api/index.js`](api/index.js): Entrypoint Serverless que exporta la aplicación Express.
- Compatible con el Application Preset **Node.js**.

---

## 📄 Licencia

Desarrollado para fines educativos bajo licencia MIT.
