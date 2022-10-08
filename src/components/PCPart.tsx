import reactLogo from "../assets/react.svg"
import type { PCPartInfo } from "../../types/api"


function PCPart({ img = reactLogo, name = "product image", manufacturer, model, MSRP, type, typeInfo }: PCPartInfo){
  return (
    <tr>
      <td>
        <img 
          src={img || "src/assets/react.svg"} 
          alt={name} 
          className="d-inline-block"
        />
      </td>
      <td>{type}</td>
      <td>{manufacturer}</td>
      <td>{model}</td>
      <td>${MSRP}</td>
      { typeInfo ? /** @todo */"" : ""}
    </tr>
  )
}

export default PCPart