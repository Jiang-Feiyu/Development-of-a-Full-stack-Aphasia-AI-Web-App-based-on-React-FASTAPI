# Amazon-Web-Service-for-Web-Application-Development
This is my final year project - a full stack development for AI speech recognization platform

## Abstract
As there are currently no technological solutions for aiding aphasiac communicate effectively, the increasing prevalence of aphasia has left many individuals struggling in daily activities. Therefore, there is need for developing a full-stack web application combining AI language models to address this pressing need. In this project, a model of utilizing the FASTAPI, AI and React full-stack model was investigated, and a web application was developed based on Python and JavaScript. By interacting with the database, the web application can provide all the fundamental functionalities including login, register and chat box function. With this technical stack, the application is accessible from any internet-connected device and seamlessly integrates user-trained AI models via API, providing rapid responses to speech inputs. The application showcases promising recognition accuracy for the 46 most commonly used Cantonese Chinese phrases, achieving a commendable 97.9% accuracy rate. Moreover, the average response time from the API remains controlled at less than 1 second, provided there is smooth network transmission, significantly enhancing convenience for users with aphasia. While the overall performance of the application is deemed acceptable, certain inefficiencies in network transmission and privacy concerns have been identified. However, it is anticipated that these challenges can be addressed through measures such as dissecting audio data and implementing robust encryption algorithms.

## Start the program
```
  front-end: `npm start`
  back-end: `uvicorn main:app --reload`
```

## Other version
- Backend of AWS EC2: https://github.com/Jiang-Feiyu/FAST-API-backend
- Frontend of AWS EC2: https://github.com/Jiang-Feiyu/React-frontend
