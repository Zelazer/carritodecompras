document.addEventListener('DOMContentLoaded', () => {
    const listaArticulos = document.getElementById('articulos');
    const listaArticulosCarrito = document.getElementById('articulosCarrito');
    const botonComprar = document.getElementById('botonComprar');
    const botonVaciar = document.getElementById('botonVaciar');
    const elementoTotal = document.getElementById('total');

    const articulos = [
        { id: 1, nombre: 'Iron Spider Man', precio: 9.99, image: 'images/spiderman.jpg' },
        { id: 2, nombre: 'Magical Unicorn', precio: 9.99, image: 'images/unicorn.jpg' },
        { id: 3, nombre: 'London Bus', precio: 9.99, image: 'images/london.jpg' },
        { id: 4, nombre: 'Exotic Peacock', precio: 19.99, image: 'images/peacock.jpg' },
        { id: 5, nombre: 'Mercedes AMG', precio: 119.99, image: 'images/mercedes.jpg' },
        { id: 6, nombre: 'Stitch', precio: 84.99, image: 'images/stitch.jpg' },
        { id: 7, nombre: 'Kawasaki Ninja', precio: 99.99, image: 'images/kawasaki.jpg' },
        { id: 8, nombre: 'Insect Collection', precio: 79.99, image: 'images/insects.jpg' },
        { id: 9, nombre: 'London Telephone', precio: 84.99, image: 'images/telephone.jpg' },
        { id: 10, nombre: 'Disney Castle', precio: 219.99, image: 'images/disney.jpg' },
    ];

    const mostrarArticulos = () => {
        for (const articulo of articulos) {
            const elementoArticulo = document.createElement('div');
            elementoArticulo.className = 'articulo';

            elementoArticulo.innerHTML = `
                <img src="${articulo.image}" alt="${articulo.nombre}">
                <h3>${articulo.nombre}</h3>
                <p>$${articulo.precio}</p>
                <button class="btn btn-danger botonAñadir" data-id="${articulo.id}">Agregar al carrito</button>
            `;

            listaArticulos.appendChild(elementoArticulo);

            elementoArticulo.querySelector('.botonAñadir').addEventListener('click', () => {
                const articuloId = parseInt(elementoArticulo.querySelector('.botonAñadir').getAttribute('data-id'));
                añadirACarrito(articuloId);
            });
        }
    }

    mostrarArticulos();

    const añadirACarrito = (id) => {
        var articulo;
        for (const i of articulos) {
            if (i.id == id) {
                articulo = i;
            }
        }
        if (articulo) {
            let articuloExistente = null;
            const articulosCarrito = listaArticulosCarrito.querySelectorAll('li');

            for (const articulo of articulosCarrito) {
                if (articulo.getAttribute('data-id') == id) {
                    articuloExistente = articulo;
                    break;
                }
            }
            if (articuloExistente) {
                let cantidad = parseInt(articuloExistente.getAttribute('data-cantidad')) + 1;
                articuloExistente.setAttribute('data-cantidad', cantidad);
                articuloExistente.innerHTML = `${articulo.nombre} <button class="btn btn-warning botonMenos">-</button> x${cantidad} <button class="btn btn-warning botonMas">+</button> - $${(articulo.precio * cantidad).toFixed(2)}`;

                actualizarTotal();

                articuloExistente.querySelector('.botonMenos').addEventListener('click', () => {
                    quitarDelCarrito(articulo.id);
                });

                articuloExistente.querySelector('.botonMas').addEventListener('click', () => {
                    añadirACarrito(articulo.id);
                });
            } else {
                const articuloCarrito = document.createElement('li');
                articuloCarrito.setAttribute('data-id', articulo.id);
                articuloCarrito.setAttribute('data-precio', articulo.precio);
                articuloCarrito.setAttribute('data-cantidad', 1);
                articuloCarrito.innerHTML = `${articulo.nombre} <button class="btn btn-warning botonMenos">-</button> x1 <button class="btn btn-warning botonMas">+</button> - $${(articulo.precio).toFixed(2)}`;
                listaArticulosCarrito.appendChild(articuloCarrito);

                articuloCarrito.querySelector('.botonMenos').addEventListener('click', () => {
                    quitarDelCarrito(articulo.id);
                });

                articuloCarrito.querySelector('.botonMas').addEventListener('click', () => {
                    añadirACarrito(articulo.id);
                });
            }

            actualizarTotal();
        }
    }

    const quitarDelCarrito = (id) => {
        const articulosCarrito = listaArticulosCarrito.querySelectorAll('li');
        for (const articulo of articulosCarrito) {
            if (articulo.getAttribute('data-id') == id) {
                let cantidad = parseInt(articulo.getAttribute('data-cantidad'));
                let precio = parseFloat(articulo.getAttribute('data-precio'))
                if (cantidad > 1) {
                    cantidad--;
                    articulo.setAttribute('data-cantidad', cantidad);
                    articulo.innerHTML = `${articulo.textContent.split(' x')[0].replace('-', '')} <button class="btn btn-warning botonMenos">-</button> x${cantidad} <button class="btn btn-warning botonMas">+</button> -$${(precio*cantidad).toFixed(2)}`;
                } else {
                    articulo.remove();
                }
                break;
            }
        }
        actualizarTotal();
    }
    
    const botonMasClick = (id) => {
        añadirACarrito(id);
    };

    const botonMenosClick = (id) => {
        quitarDelCarrito(id);
    };

    listaArticulosCarrito.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('botonMas')) {
            const id = parseInt(target.parentNode.getAttribute('data-id'));
            botonMasClick(id);
        } else if (target.classList.contains('botonMenos')) {
            const id = parseInt(target.parentNode.getAttribute('data-id'));
            botonMenosClick(id);
        }
    });
    

    const actualizarTotal = () => {
        let total = 0;
        const articulosCarrito = listaArticulosCarrito.querySelectorAll('li');

        for (const articulo of articulosCarrito) {
            const precioUnitario = parseFloat(articulo.getAttribute('data-precio'));
            const cantidad = parseInt(articulo.getAttribute('data-cantidad'));
            total += precioUnitario * cantidad;
        }

        elementoTotal.textContent = `$${total.toFixed(2)}`;
        document.querySelector('.total').textContent=`$${total.toFixed(2)}`;
    }


    botonVaciar.addEventListener('click', () => {
        listaArticulosCarrito.innerHTML = '';
        const formularioCompra = document.getElementById('formularioCompra');
        formularioCompra.style.display = 'none';
        actualizarTotal();
    });

    botonComprar.addEventListener('click', () => {
        const formularioCompra = document.getElementById('formularioCompra');
        formularioCompra.style.display = 'block';

        const enviarCompra = document.getElementById('enviarCompra');
        enviarCompra.addEventListener('click', () => {
            const nombre = document.getElementById('nombre').value;
            const correo = document.getElementById('correo').value;
            const id = document.getElementById('id').value;

            const mensajeCompraExitosa = document.getElementById('mensajeCompraExitosa');
            mensajeCompraExitosa.style.display = 'block';

        });
});


});

