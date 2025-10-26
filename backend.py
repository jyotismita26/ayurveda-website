
from flask import render_template, request, redirect, url_for

# Sample credentials
USER_CREDENTIALS = {
    "jyotismita": "j1234",
    "testuser": "password"
}


def show_login_page():
    return render_template("login.html")

def handle_login(request):
    username = request.form.get('username')
    password = request.form.get('password')

    if USER_CREDENTIALS.get(username) == password:
        return redirect(url_for('home'))
    else:
        return render_template("result.html", message=" Login Failed: Wrong username or password")
