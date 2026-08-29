    import { useEffect, useState } from "react";
    import { useNavigate } from "react-router-dom";

    const Dashboard = () =>{
        const [email,setEmail] = useState<string|null>(null);

        const navigate = useNavigate();

    
        useEffect(()=>{
            const getDashboard = async () => {
                try {
                    const response = await fetch("http://localhost:8000/dashboard",{
                        credentials:"include",
                    });

                    if(!response.ok){
                        navigate("/login");
                        return;
                    }

                    const data = await response.json();
                    setEmail(data.email);
                }catch(error){
                    console.error(error);
                    navigate("/login");
                }
            };

            getDashboard();


        },[navigate]);


        return <h1>{email}</h1>
    }

    export default Dashboard;