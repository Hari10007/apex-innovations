import React, { useEffect, useState } from "react";
import {
  MDBContainer,
  MDBRow,
} from "mdb-react-ui-kit";

import { useParams} from "react-router-dom";
import ChatLog from "./ChatLog";
import ChatSideBar from "./ChatSideBar";

function MyChat() {
  const params = useParams();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const params_present  =  params?.id ? true : false

 
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

 
  
  return (
    <MDBContainer fluid className="py-1" style={{ backgroundColor: "#fff" }}>
      <MDBRow>
        {isMobile && (params_present ? <ChatLog /> : <ChatSideBar />)}
 
        {!isMobile && 
          <>
            <ChatSideBar />
            {params_present && <ChatLog />}
          </>
        }
      </MDBRow>
    </MDBContainer>
  );
}

export default  MyChat