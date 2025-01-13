import "./Card.css";    

export default function Card({onClick, characterId, characterName, characterImage}) {
    return (
        <div
            className="card-container"
            data-character-id={characterId} 
            onClick={() => onClick()}
        >
            <div className="card">
                <div className="card-front inner-card">
                    <div className="card-front card-content">
                        <img 
                            className="card-character-image"
                            src={characterImage}    
                            alt={'character: ' + characterName}         
                        />
                        <p className='card-character-name'>{characterName}</p>  
                    </div>
                </div>
                <div className="card-back inner-card">
                    <div className="chip"></div>    
                </div>
            </div> 
        </div>
    )
}