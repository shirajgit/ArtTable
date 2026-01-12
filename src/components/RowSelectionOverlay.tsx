import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { useRef, useState } from "react";

interface Props {
  onSelect: (count: number) => void;
}

export default function RowSelectionOverlay({ onSelect }: Props) {
  const overlayRef = useRef<OverlayPanel>(null);
  const [count, setCount] = useState<number | null>(null);
    const [toast, setToast] = useState("");


  const applySelection = () => {
    if (!count || count <= 0) {
      setToast("⚠️Enter a valid number of rows.");
      return;
    }
    setToast('')
    onSelect(count);
    overlayRef.current?.hide();
    setCount(null);
  };

 

  return (
    <>
      <Button
        label="Custom Select"
        style={{  fontSize:'25px', marginBottom:'12px',  marginLeft:'20px' , borderRadius:'1rem'  }}
        onClick={(e) => overlayRef.current?.toggle(e)}
      /> 
        {toast && (
          <div className="mr-0 p-2 fixed rounded bg-gray-100 text-gray-900 shadow-md border-l-4 border-indigo-500 animate-fade-in">
            {toast}
          </div>
        )}

      <OverlayPanel ref={overlayRef}>
        <div style={{  fontSize:'25px' ,display: "flex", gap: "0.5rem" }}>
          <InputNumber
            value={count}
            onValueChange={(e) => setCount(e.value as number)}
            placeholder="Rows"
          />
          <Button label="Apply" onClick={applySelection} />
        </div>
      </OverlayPanel>
    </>
  );
}