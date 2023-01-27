import './imageTable.css'

const ImageTable = ({images}) => {

	return (
		<div className = 'mainTableBody'>
		<div className = {'table'}>
		{images.map(entry => {
			let artistFn = entry[0]
			return (
				<>
				<img src = {process.env.PUBLIC_URL + '/assets/FairFace/' + artistFn} />
				<img src = {process.env.PUBLIC_URL + '/assets/PlaceholderDrawings(PNG)/' + entry[1]} />
				<img src = {process.env.PUBLIC_URL + '/assets/PlaceholderDrawings(PNG)/' + entry[2]} />
				</>
				)


		})}
		</div>
		</div>

		)

}

export default ImageTable