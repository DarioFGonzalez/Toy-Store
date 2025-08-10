import axios from 'axios';
import React, {useState} from 'react';
import { Form } from 'react-bootstrap';
import styles from './Create.module.css';
import { formProduct, URL } from '../../types/constants';

const Create: React.FC = () =>
{
	const [form, setForm] = useState(formProduct)
	const [ images, setImages ] = useState<File[]>( [] );
	const [ previewImages, setPreviewImages ] = useState<string[]>( [] );
	const [ errores, setErrores ] = useState(formProduct);

	const handleSubmit = ( e: React.FormEvent<HTMLFormElement> ) =>
    {
		e.preventDefault();

        let completedForm = {};

        if(images.length>0)
        {
            completedForm =
            {
                name: form.name,
                description: form.description,
                price: form.price,
                imageUrl: images,
                category: form.category,
                stock: form.stock
            }
        }
        else
        {
            completedForm =
            {
                name: form.name,
                description: form.description,
                price: form.price,
                category: form.category,
                stock: form.stock
            }
        }

        try
        {
			const adminToken = localStorage.getItem( 'adminToken' );
            axios.post(`${URL}product`, completedForm, { headers: { 'Authorization': `Bearer ${adminToken}` } } )
			.then( ( { data } ) =>
			{
				console.log( data );
			})
            alert('¡Usuario creado!')

            setForm(formProduct);
            setErrores(formProduct);
        }
        catch(error)
        {
            console.log({Error_HandleSubmit: error})
            alert('¡Ocurrió un error!')
        }

	}

	const handleChange = ( e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> ) =>
    {
		const {name, value} = e.target

		setForm(prevInput =>
        ({
			...prevInput,
			[name]: value,
		}))

		setErrores(prevErrores =>
        ({
			...prevErrores,
			[name]: undefined,
		}))
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	if (!e.target.files) {
		return;
	}
	
	const files = Array.from(e.target.files);
	
	if (files.length > 5) {
		alert('Solo puedes subir hasta 5 imágenes.');
		setImages( [] );
		setPreviewImages ( [] );
		return;
	}

	setImages(files);	
	
	const urls = files.map(file => {
		return new Promise((resolve) => {
		const reader = new FileReader();
		reader.onload = (event) => {
			event.target!==null && resolve(event.target.result);
		};
		reader.readAsDataURL(file);
		});
	});

	Promise.all(urls).then(results => {
		setPreviewImages(results as string[]);
	});
	};

	return (
		<div className={styles.formContainer}>
			<form className={`${styles.formChild}`} onSubmit={handleSubmit}>
				<h1>Postear producto</h1>

				<div>
					<Form.Control name='name' placeholder='Nombre' value={form.name} onChange={handleChange} />
				</div>

                <div>
					<label>Precio</label>
					<Form.Control name='price' placeholder='Precio' value={form.price} onChange={handleChange} />
				</div>

                <div>
					<input type="file" multiple onChange={handleFileChange} accept="image/*"/>
					{ previewImages.length>0 && previewImages.map( (item, y) =>
					<img src={item} style={{ width: '150px', height: '150px', objectFit: 'cover' }} key={y} />) }				
				</div>

				<div>
					<Form.Select aria-label='Default select example' name='category' value={form.category} onChange={handleChange}>
						<option value='default'>Categoria:</option>
						<option value='juego de mesa'> Juego de mesa </option>
						<option value='muñeco'> Muñeco </option>
						<option value='peluche'> Peluche </option>
						<option value='otros'> Otros </option>
					</Form.Select>
				</div>

                <div>
					<label>Stock</label>
					<Form.Control name='stock' placeholder='STOCK Inicial' value={form.stock} onChange={handleChange} />
				</div>

                <div>
					<Form.Control name='description' placeholder='Descripción' value={form.description} onChange={handleChange} />
					{errores.description && <p>{errores.description}</p>}
				</div>

				<button type='button' onClick={ ()=> console.log( images ) }>
					Imagenes cargadas so far
				</button>

				<button className='btn btn-primary mb-3' type='submit'>
					Crear
				</button>
			</form>
		</div>
	)
}

export default Create;