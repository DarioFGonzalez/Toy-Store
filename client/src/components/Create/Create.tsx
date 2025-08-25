import axios from 'axios';
import React, {useState} from 'react';
import { Form } from 'react-bootstrap';
import styles from './Create.module.css';
import { emptyFormProduct, URL } from '../../types/constants';
import type { DBImagesFormat, FormProduct } from '../../types';

const Create: React.FC = () =>
{
	const [form, setForm] = useState<FormProduct>(emptyFormProduct)
	const [ images, setImages ] = useState<File[]>( [] );
	const [ previewImages, setPreviewImages ] = useState<string[]>( [] );

	const handleSubmit = async ( e: React.FormEvent<HTMLFormElement> ) =>
    {
		e.preventDefault();

        let completedForm = {};

		try
		{
			if(images.length>0)
			{
				const uploadedImages = await handleImagesUpload();
				completedForm =
				{
					name: form.name,
					description: form.description,
					price: form.price,
					imageUrl: uploadedImages,
					category: form.category,
					medidas: form.medidas,
					materials: form.material,
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
					medidas: form.medidas,
					materials: form.material,
					stock: form.stock
				}
			}

			const adminToken = localStorage.getItem( 'adminToken' );

			await axios.post(`${URL}product`, completedForm, { headers: { 'Authorization': `Bearer ${adminToken}` } } );
            
            alert('¡Artículo creado!');

			setImages( [] );
			setPreviewImages( [] );
            setForm(emptyFormProduct);
        }
        catch(error)
        {
            console.log({Error_HandleSubmit: error})
            alert('¡Ocurrió un error!')
        }
		

	}

	const handleImagesUpload = async (): Promise<DBImagesFormat[]> =>
	{
		const promises = images.map( file =>
		{
			const formData = new FormData();
			formData.append( 'file', file );
			formData.append( 'upload_preset', 'violeta_store' );
			return axios.post(`https://api.cloudinary.com/v1_1/violetastore/upload`, formData);
		} );

		const responses = await Promise.all( promises );

		const Images = responses.map( response => ( { url: response.data.secure_url, public_id: response.data.public_id } ) );

		return Images;
	}

	const handleChange = ( e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> ) =>
    {
		const {name, value} = e.target

		setForm(prevInput =>
        ({
			...prevInput,
			[name]: value,
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

	const handleImageOrder = ( index: number ): void =>
	{
		if(index===0) return ;

		const tempImages = [ ...images ];
		const tempPreviews = [ ...previewImages ];

		const tempImages0 = tempImages[0];
		tempImages[0] = tempImages[index];
		tempImages[index] = tempImages0;

		const tempPreviews0 = tempPreviews[0];
		tempPreviews[0] = tempPreviews[index];
		tempPreviews[index] = tempPreviews0;

		setImages( tempImages );
		setPreviewImages( tempPreviews );
	}

	const excludeImage = ( index: number ): void =>
	{
		setImages( prev => prev.filter( (_, y) => index!==y ) );
		setPreviewImages( prev => prev.filter( (_, y) => index!==y ) );
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
					<div className={styles.container}>
						<div className={styles.folder}>
							<div className={styles.top}></div>
							<div className={styles.bottom}></div>
						</div>
						<label className={styles.customFileUpload}>
							<input className={styles.title} type="file" multiple onChange={handleFileChange} accept="image/*" />
							Choose a file
						</label>
					</div>
					{previewImages.length > 0 && 
						<div className={styles.imagePreviewGrid}>
						{previewImages.map((item, index) => (
							<div key={index} 
								className={`${styles.previewContainer} ${index === 0 ? styles.mainImage : ''}`}>
							<img
								src={item}
								alt={`Preview ${index}`}
								onClick={() => handleImageOrder(index)}
							/>
							<button type="button" onClick={() => excludeImage(index)}>
								&times;
							</button>
							</div>
						))}
						</div>
					}
				</div>

				<div>
					<Form.Select aria-label='Default select example' name='category' value={form.category} onChange={handleChange}>
						<option value='default'>Categoria:</option>
						<option value='aros'> Aros </option>
						<option value='anillos'> Anillos </option>
						<option value='cadenitas'> Cadenitas </option>
						<option value='chokers'> Chokers </option>
						<option value='collares'> Collares </option>
						<option value='gargantillas'> Gargantillas </option>
						<option value='pulseras'> Pulseras </option>
						<option value='tobilleras'> Tobilleras </option>
						<option value='otros'> Otros </option>
					</Form.Select>
				</div>

				<div>
					<Form.Select aria-label='Default select example' name='material' value={form.material} onChange={handleChange}>
						<option value='default'>Material:</option>
						<option value='acero quirurgico'> Acero quirúrgico </option>
						<option value='alambre con memoria'> Alambre con memoria </option>
						<option value='cristal checo'> Cristal checo </option>
						<option value='fundicion'> Fundición </option>
						<option value='hilo encerado'> Hilo encerado </option>
						<option value='madera'> Madera </option>
						<option value='mostacillas'> Mostacillas </option>
						<option value='perlas de vidrio'> Perlas de vidrio </option>
						<option value='perlas acrilicas'> Perlas acrilicas </option>
						<option value='piedras semipreciosas'> Piedras semipreciosas </option>
						<option value='tanza de acero'> Tanza de acero </option>
						<option value='tanza elastica'> Tanza elástica </option>
					</Form.Select>
				</div>

				<div>
					<Form.Select aria-label='Default select example' name='medidas' value={form.medidas} onChange={handleChange}>
						<option value='default'>Medida:</option>
						<option value='30'> 30 CM </option>
						<option value='40'> 40 CM </option>
						<option value='50'> 50 CM </option>
						<option value='60'> 60 CM </option>
						<option value='70'> 70 CM </option>
						<option value='80'> 80 CM </option>
						<option value='90'> 90 CM </option>
						<option value='100'> 100 CM </option>
					</Form.Select>
				</div>

                <div>
					<label>Stock</label>
					<Form.Control name='stock' placeholder='STOCK Inicial' value={form.stock} onChange={handleChange} />
				</div>

                <div>
					<Form.Control name='description' placeholder='Descripción' value={form.description} onChange={handleChange} />
				</div>

				<button className='btn btn-primary mb-3' type='submit'>
					Crear
				</button>
			</form>
		</div>
	)
}

export default Create;