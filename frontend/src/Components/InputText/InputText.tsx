import './inputText.scss'

const InputText = ({value,setValue}) => {

	return (
	
		
          <textarea className = 'textInput' value={value} onChange={setValue} />
      
      
		)

}

export default InputText