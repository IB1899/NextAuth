"use client"
import { MutableRefObject, useEffect, useRef, useState } from 'react';

export default function CameraSwitcher() {

    //! It's like useState when the component rerenders it retains its value
    let h1Ref = useRef() as MutableRefObject<HTMLHeadingElement>

    const [Switch, setSwitch] = useState(false);

    useEffect(() => {
        h1Ref.current.textContent = "hello"
    }, [Switch])

    return (
        <div>

            <h1 ref={h1Ref}>  </h1>

            <button onClick={() => setSwitch((prev) => !prev)} > {Switch ? "click" : "already clicked"} </button>

        </div>
    );
};







