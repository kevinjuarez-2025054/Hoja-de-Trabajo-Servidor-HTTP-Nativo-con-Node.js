import { IncomingMessage, ServerResponse } from 'node:http';
import { ClienteRepository } from '../data/clienteRepository';
import { ProductoRepository } from '../data/productoRepository';
 
const clienteRepo = new ClienteRepository();
const productoRepo = new ProductoRepository();
 
const obtenerBody = (req: IncomingMessage): Promise<string> => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => resolve(body));
        req.on('error', err => reject(err));
    });
};
 
const enviarRespuesta = (res: ServerResponse, codigo: number, datos: any) => {
    res.writeHead(codigo, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(datos));
};
 
export const router = async (req: IncomingMessage, res: ServerResponse) => {
    const { url, method } = req;
   
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
 
    if (method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }
 
    try {
        if (url === '/api/clientes') {
            if (method === 'GET') {
                const lista = await clienteRepo.obtenerTodos();
                return enviarRespuesta(res, 200, lista);
            }
           
            if (method === 'POST') {
                const body = await obtenerBody(req);
                const nuevoCliente = JSON.parse(body);
                const creado = await clienteRepo.guardar(nuevoCliente);
                return enviarRespuesta(res, 201, creado);
            }
        }
 
        if (url === '/api/productos') {
            if (method === 'GET') {
                const lista = await productoRepo.obtenerTodos();
                return enviarRespuesta(res, 200, lista);
            }
 
            if (method === 'POST') {
                const body = await obtenerBody(req);
                const nuevoProducto = JSON.parse(body);
                const creado = await productoRepo.guardar(nuevoProducto);
                return enviarRespuesta(res, 201, creado);
            }
        }
 
        if (url?.startsWith('/api/productos/')) {
            const id = parseInt(url.split('/').pop() || '0', 10);
 
            if (method === 'GET') {
                const producto = await productoRepo.obtenerPorId(id);
                if (!producto) return enviarRespuesta(res, 404, { error: 'Producto no encontrado' });
                return enviarRespuesta(res, 200, producto);
            }
        }
 
        return enviarRespuesta(res, 404, { error: 'Ruta no encontrada' });
 
    } catch (error: any) {
        console.error('Error en el router:', error);
        return enviarRespuesta(res, 500, {
            error: 'Error interno del servidor',
            detalles: error.message
        });
    }
};
 