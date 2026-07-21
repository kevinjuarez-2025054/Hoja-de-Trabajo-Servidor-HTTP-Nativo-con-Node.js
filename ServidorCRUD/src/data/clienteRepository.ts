import { PersistenciaService } from '../services/persistenciaService';
import { Cliente } from "../models//clientes";
 
export class ClienteRepository {
    private persistencia = new PersistenciaService();
 
    async obtenerTodos(): Promise<Cliente[]> {
        return await this.persistencia.leerClientes();
    }
 
    async obtenerPorId(id: number): Promise<Cliente | null> {
        const clientes = await this.persistencia.leerClientes();
        return clientes.find(c => c.id === id) || null;
    }
 
    async guardar(nuevoCliente: Cliente): Promise<Cliente> {
        const clientes = await this.persistencia.leerClientes();
        clientes.push(nuevoCliente);
        await this.persistencia.guardarClientes(clientes);
        return nuevoCliente;
    }
 
    async actualizar(id: number, datosActualizados: Partial<Cliente>): Promise<Cliente | null> {
        const clientes = await this.persistencia.leerClientes();
        const indice = clientes.findIndex(c => c.id === id);
        if (indice === -1) return null;
 
        clientes[indice] = { ...clientes[indice], ...datosActualizados, id };
        await this.persistencia.guardarClientes(clientes);
        return clientes[indice];
    }
 
    async eliminar(id: number): Promise<boolean> {
        const clientes = await this.persistencia.leerClientes();
        const longitudInicial = clientes.length;
        const filtrados = clientes.filter(c => c.id !== id);
       
        if (filtrados.length === longitudInicial) return false;
       
        await this.persistencia.guardarClientes(filtrados);
        return true;
    }
}