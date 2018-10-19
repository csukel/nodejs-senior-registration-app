console.log('Test Async Await');

const apiCall = ()=>{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            // resolve('Ok');
            reject(new Error('API is offline'));
            
        },1000)
    })
}

const getData = async () => {
    try {
        let res = await apiCall();
        console.log(res);
    }catch(e){
        console.log(e);
    }

}

getData();
