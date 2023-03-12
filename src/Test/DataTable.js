import DataList from "./DataList";

function DataTable(props)
{
    return(
        <tbody>
            {
               props.data.map((elem,idx)=>
                    (<DataList key={idx} data={elem}/>))
            }
        </tbody>
    );
}

export default DataTable;