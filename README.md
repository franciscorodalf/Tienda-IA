# TIENDA.IA | E-COMMERCE DE STREETWEAR

## Visión General

Tienda.IA es una plataforma de comercio electrónico moderna impulsada por IA, diseñada para el futuro de la moda streetwear. Integra un Estilista de IA sofisticado ("Alex") directamente en la experiencia de compra, permitiendo a los usuarios recibir recomendaciones de atuendos personalizadas, detalles técnicos de productos y consejos de estilo en tiempo real.

El proyecto enfatiza una estética minimalista y "anti-diseño" popular en la cultura moderna del streetwear (reminiscente de estilos como el de Ye o la moda industrial), enfocándose en imágenes crudas, tipografía audaz y una experiencia de usuario fluida.

## Características Principales

### 1. Estilista Potenciado por IA (Alex)
- **Integración**: Interfaz de chat flotante global disponible en toda la aplicación.
- **Modelo**: Impulsado por Google Gemini 2.5 Flash para respuestas de alta velocidad y conscientes del contexto.
- **Capacidades**: Puede buscar en el catálogo de productos, explicar detalles técnicos de las telas (GSM, ajuste) y proporcionar consejos de estilo.
- **Comportamiento Inteligente**: Involucra automáticamente al usuario después de un breve retraso (una vez por sesión) para simular una experiencia personalizada en tienda.

### 2. Catálogo de Productos Moderno
- **Categorías**: Sudaderas, Camisetas, Pantalones, Chaquetas, Zapatos y Accesorios.
- **Filtrado**: Filtrado de categorías en tiempo real.
- **Validación**: Lógica estricta de "Añadir al Carrito" que requiere que los usuarios seleccionen opciones específicas de Talla y Color antes de comprar.

### 3. Editorial y Archivo
- **Rico en Contenido**: Sección dedicada de "Archivo" con contenido editorial, diarios visuales y manifiestos.
- **Estética**: Imágenes de alta calidad y diseño de maquetación que refuerza la identidad de la marca.

### 4. Stack Técnico
- **Framework**: Next.js 15 (App Router).
- **Estilos**: Tailwind CSS para estilos de utilidad primero.
- **Animaciones**: Framer Motion para transiciones e interacciones suaves.
- **Gestión de Estado**: React Context API para la gestión global del carrito.
- **Iconos**: Lucide React.

## Guía de Inicio

Sigue estos pasos para configurar el proyecto localmente.

### Prerrequisitos
- Node.js 18.0.0 o superior
- npm o yarn
- Una Clave API de Google AI Studio

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/tienda-ia.git
   cd tienda-ia
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configuración de Entorno**
   **Advertencia de Seguridad**: Nunca confirmes tus claves API en el control de versiones.
   
   Crea un archivo `.env.local` en el directorio raíz:
   ```bash
   touch .env.local
   ```
   
   Añade tu Clave API de Google Gemini:
   ```env
   GOOGLE_API_KEY=tu_clave_api_aqui
   ```

4. **Ejecutar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

   Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

## Seguridad

Este proyecto está configurado para aplicar mejores prácticas de seguridad:
- **Variables de Entorno**: Todas las claves sensibles (Clave API de Google) se almacenan en `.env.local` y se accede a ellas solo en el lado del servidor a través de `process.env`.
- **Git Ignoring**: El archivo `.gitignore` está configurado para excluir todos los archivos de entorno (`.env`, `.env.local`, etc.) de ser rastreados por Git.
- **Sanitización**: El prompt del sistema de IA está estrictamente gobernado para evitar comportamientos no deseados.

## Estructura del Proyecto

- `/app`: Rutas principales de la aplicación (Inicio, Sobre Nosotros, Archivo).
- `/components`: Componentes de UI reutilizables (FichaProducto, Chat, CajónCarrito).
- `/context`: Proveedores de estado global (ContextoCarrito).
- `/lib`: Funciones de utilidad y datos estáticos (catálogo de productos).
- `/api`: Rutas API del lado del servidor para interacción con IA.

## Licencia

Este proyecto es de código abierto y está disponible bajo la Licencia MIT.
