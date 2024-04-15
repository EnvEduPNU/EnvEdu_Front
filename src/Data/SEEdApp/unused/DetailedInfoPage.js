function DetailedInfoPage(props) {
    return (
        <div>
            {props.types.map((type)=>(<div key={type}>{type}</div>))}
        </div>
    );
}

export default DetailedInfoPage;