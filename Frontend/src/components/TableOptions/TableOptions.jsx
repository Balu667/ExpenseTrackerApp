import {FaEdit} from 'react-icons/fa';

function TableOptions({editOnClick}){
    return(
        <div style={{display:'flex',gap:'10px'}}>
            <FaEdit onClick={editOnClick} />
        </div>
    )
}

export default TableOptions;