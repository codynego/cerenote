interface DropDownProps {
    dropDown: boolean;
    setDropDown: (dropDown: boolean) => void;
}

export const DropDown = ({ dropDown, setDropDown }: DropDownProps) => {
  return (
    <div>
        <div onClick={() => setDropDown(!dropDown)}>
            {dropDown ? <i className="fa-solid fa-caret-down" ></i> : <i className="fa-solid fa-caret-right" ></i>}
        </div>
    </div>
  )
}
