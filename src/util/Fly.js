window.Mes = 'http://120.77.8.170:801/';

const Fly = async ({to,type,par}) => {
    const {userCode} = JSON.parse(localStorage.getItem("$loginInfo"));
    const tm = new Date().getTime();
    return await fetch(`${window.Mes}mes-access`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/xml' },
        body: 
        `
        <msg id="${"WEB"+tm+"^"+userCode}" from="${userCode+"@coship-mes.com/WEB"}" to="${to}" type="${type}">
            <body>
            ${par}
            </body>
        </msg>
        `
    })
    .then((response) => {
        if (response.ok) {
            return response.text();
        }
    })
    .catch((err) => {
        console.warn(err);
    })
}

export default Fly;