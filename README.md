# Social Network 
Small replica of Twitter

## Screenshots
![Homepage](https://github.com/user-attachments/assets/534af8a9-699f-4653-b296-765937ef6f1b)
![Post](https://github.com/user-attachments/assets/19b96556-f2df-496b-86ca-4454c4330511)
![Profile](https://github.com/user-attachments/assets/8040eb0f-471c-43bd-9a54-b82dd0885c24)
![Following Posts](https://github.com/user-attachments/assets/083ad778-6235-4164-a149-11a46a8a23a9)
![Login/Register](https://github.com/user-attachments/assets/f6bf2cf9-bf84-4bb1-a16a-83c5d3496354)
![Others' Profile](https://github.com/user-attachments/assets/45054dce-6713-4718-8c8b-42a433bc9f7f)

## Technologies Used
- Python (Django)
- JavaScript
- CSS (Bootstrap)
- Postgres

## Features
- User authentication (sign up, login, and logout)
- Create, edit, like posts
- Follow/Unfollow others
- See posts from Following
- Keep a record of folllowing, followers, posts

## Installation 
1. Install dependencies:
   `pip install -r requirements.txt`
2. Create .env in your root folder 
    `touch .env`
3. Create your local Postgres DB and replace the followings in .env:
    ```
    NAME=mydatabase
    USER=myusername
    PASSWORD=mypassword
    HOST=localhost  //You can change it if you want 
    PORT=5433   //Deafult one

    ```
4. Apply migrations:
   `python manage.py migrate`
5. Run the development server:
   `python manage.py runserver`
6. Open your browser and navigate to:
   `http://127.0.0.1:8000/`
## Contributing 
Contributions are welcome! Please open a pull request.
