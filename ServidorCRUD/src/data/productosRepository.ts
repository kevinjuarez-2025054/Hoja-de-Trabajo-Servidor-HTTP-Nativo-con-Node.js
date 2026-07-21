import { PersistenciaService } from '../services/persistenciaService.js';
import { Producto } from '../models/productos';
 
export class ProductoRepository {
    private persistencia = new PersistenciaService();
 
    async obtenerTodos(): Promise<Producto[]> {
        return await this.persistencia.leerProductos();
    }
 
    async obtenerPorId(id: number): Promise<Producto | null> {
        const productos = await this.persistencia.leerProductos();
        return productos.find(p => p.id === id) || null;
    }
 
    async guardar(nuevoProducto: Producto): Promise<Producto> {
        const productos = await this.persistencia.leerProductos();
        productos.push(nuevoProducto);
        await this.persistencia.guardarProductos(productos);
        return nuevoProducto;
    }
 
    async actualizar(id: number, datosActualizados: Partial<Producto>): Promise<Producto | null> {
        const productos = await this.persistencia.leerProductos();
        const indice = productos.findIndex(p => p.id === id);
        if (indice === -1) return null;
 
        productos[indice] = { ...productos[indice], ...datosActualizados, id };
        await this.persistencia.guardarProductos(productos);
        return productos[indice];
    }
 
    async eliminar(id: number): Promise<boolean> {
        const productos = await this.persistencia.leerProductos();
        const longitudInicial = productos.length;
        const filtrados = productos.filter(p => p.id !== id);
       
        if (filtrados.length === longitudInicial) return false;
       
        await this.persistencia.guardarProductos(filtrados);
        return true;
    }
}