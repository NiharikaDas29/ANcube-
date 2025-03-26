import Image from "next/image";
export default function Cards() {
    let items=[
        {
            tags:"#tag1",
            description:"lorem ipsum",
            image:"/images/elephant.jpg"
        },
        {
            tags:"#tag2",
            description:"something2",
            image:"/images/elephant.jpg"
        },
        {
            tags:"#tag2",
            description:"something2",
            image:"/images/elephant.jpg"
        },
        {
            tags:"#tag2",
            description:"something2",
            image:"/images/elephant.jpg"
        },
    ]

    return(
        <>
            
            <div  className="flex flex-wrap justify-center gap-5  p-10 ">
            {items.map((item) => (
            <div  key={item.id} className="card bg-gray-500  shadow-lg flex flex-col p-5 rounded-lg  ">
                <figure>
                    <Image
                    src={item.image}
                    width="250"
                    height="250"
                    alt="Shoes"
                     />
                </figure>
                
                            <div className="card-body">
                                <h2 className="card-title">{item.tags}</h2>
                                <p>{item.description}</p>
                                <div className="card-actions justify-end">
                                <button className="btn btn-error">Edit</button>
                                </div>
                            </div>

            </div>
            ))}
            </div>
            
        
        </>
    );
}