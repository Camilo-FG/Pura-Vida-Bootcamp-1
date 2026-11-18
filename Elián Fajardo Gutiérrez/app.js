import { fetchBalance, lookupNetwork } from "./horizon.js";

const account = document.querySelector("#account");
const address = document.querySelector("#address");
const balance = document.querySelector("#balance");
const network = document.querySelector("#network");
const status = document.querySelector("#status");
const connect = document.querySelector("#connect");
const refresh = document.querySelector("#refresh");
const disconnect = document.querySelector("#disconnect");
const install = document.querySelector("#install");

function setConnected(connected) {
  account.hidden = !connected;
  connect.hidden = connected;
  refresh.hidden = !connected;
  disconnect.hidden = !connected;
}

async function syncWallet(requestAccess) {
  connect.disabled = refresh.disabled = disconnect.disabled = true;
  status.textContent = "Consultando la wallet…";
  install.hidden = true;
  balance.textContent = "—";

  try {
    const wallet = window.freighterApi;
    if (!wallet) throw new Error("No se pudo cargar el SDK de la wallet. Recarga la página.");
    const availability = await wallet.isConnected();
    if (!availability.isConnected) {
      install.hidden = false;
      throw new Error("Activa la extensión de Varial / Freighter en este navegador.");
    }

    const result = await (requestAccess ? wallet.requestAccess() : wallet.getAddress());
    if (result.error || !/^G[A-Z2-7]{55}$/.test(result.address ?? "")) {
      throw new Error("No se recibió una dirección pública. Desbloquea la wallet y autoriza el acceso.");
    }

    address.textContent = result.address;
    network.textContent = "Sin identificar";
    setConnected(true);

    const selected = await wallet.getNetwork();
    const horizon = lookupNetwork(selected.network);
    network.textContent = horizon?.label ?? (selected.network || "Sin identificar");

    if (selected.error || !horizon) {
      status.textContent = "El saldo está disponible en Mainnet y Testnet. Cambia la red en tu wallet y pulsa Actualizar.";
      return;
    }

    const amount = await fetchBalance(horizon.endpoint, result.address);
    balance.textContent = amount === null ? "—" : `${amount} XLM`;
    status.textContent = amount === null ? "Esta cuenta aún no existe en la red seleccionada." : "";
  } catch (error) {
    status.textContent = account.hidden ? error.message : "No se pudo consultar la cuenta. Pulsa Actualizar para volver a intentarlo.";
  } finally {
    connect.disabled = refresh.disabled = disconnect.disabled = false;
  }
}

connect.addEventListener("click", () => syncWallet(true));
refresh.addEventListener("click", () => syncWallet(false));
disconnect.addEventListener("click", async () => {
  disconnect.disabled = refresh.disabled = true;
  try {
    const result = await window.freighterApi.disconnect();
    if (result?.error) throw new Error(result.error.message);
    setConnected(false);
    address.textContent = network.textContent = balance.textContent = "";
    status.textContent = "Wallet desconectada.";
  } catch {
    status.textContent = "No se pudo desconectar. Puedes revocar el acceso desde la extensión.";
  } finally {
    disconnect.disabled = refresh.disabled = false;
  }
});
