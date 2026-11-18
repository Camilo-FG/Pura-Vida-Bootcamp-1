# Órbita Stellar

**Autor:** Elián Fajardo Gutiérrez

Visor de solo lectura para una cuenta Stellar. Conecta la extensión Varial (antes Freighter), lee la dirección pública y consulta el saldo XLM de la red seleccionada en la wallet. Admite Mainnet y Testnet.

## Ejecutar

1. Instala y desbloquea la [extensión Varial / Freighter](https://www.freighter.app/).
2. En esta carpeta, ejecuta `python -m http.server 4173 --bind 127.0.0.1`.
3. En el mismo navegador que tiene la extensión, abre `http://127.0.0.1:4173`, pulsa **Conectar wallet** y aprueba la solicitud.
4. Para consultar otra cuenta o red, cambia la selección en la extensión y pulsa **Actualizar**. Al pulsar **Desconectar**, la app pide a la extensión que revoque el acceso.

El saldo se consulta mediante la API pública de Horizon. Una cuenta que aún no existe en la red muestra un mensaje de cuenta sin activar. La aplicación necesita Internet para cargar el SDK de la wallet y consultar Horizon.

## Apoyo de Stellar Raven

El [catálogo oficial de Stellar Raven](https://github.com/stellar-experimental/stellar-raven/blob/3e490ec/ecosystem-skills/INDEX.md) identifica la guía [Frontend & Wallets](https://github.com/stellar/stellar-dev-skill/blob/421ca30a671cd32d7d6466e8b903f10d79dc1590/skills/dapp/SKILL.md). Consulté esa guía para validar el flujo `isConnected()` → `requestAccess()` y la selección del servidor Horizon para cada red. La integración usa la versión 7.0.0 de [Varial SDK](https://github.com/stellar/freighter-developer-docs/blob/main/extension/installation.md).

El endpoint remoto de Raven requiere iniciar sesión mediante OAuth. La consulta de la guía anterior se hizo directamente en el material que referencia Raven.
