fetch('https://api.ipify.org?format=json')
  .then(response => response.json())
  .then(data => {
    console.log("Your IP address is: ", data.ip);
  })
  .catch(error => {
    console.error("Error fetching IP address:", error);
  });