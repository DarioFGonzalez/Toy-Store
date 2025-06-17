import axios from 'axios';
import React, {useState} from 'react';
import { Form } from 'react-bootstrap';
import styles from './Create.module.css';
import { formProduct } from '../../types/constants';

const Create: React.FC = () =>
{
	const [form, setForm] = useState(formProduct)
	const [errores, setErrores] = useState(formProduct)

	const handleSubmit = ( e: React.FormEvent<HTMLFormElement> ) =>
    {
		e.preventDefault()

        let completedForm = {};

        if(form.image!=='')
        {
            completedForm =
            {
                name: form.name,
                description: form.description,
                price: form.price,
                image: form.image,
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
            axios.post('http://localhost:5000/product', completedForm)
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
					<Form.Control name='image' placeholder='URL Imagen' value={form.image} onChange={handleChange} />
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

				<button className='btn btn-primary mb-3' type='submit'>
					Crear
				</button>
			</form>
		</div>
	)
}

export default Create;