import werkzeug
from flask import Flask, request, render_template, escape, session, redirect, url_for, send_from_directory
import os

app = Flask(__name__)


# Url for title screen
@app.route('/')
def menu():
    return render_template('index.html')


# Url to game & save character as session
@app.route('/play', methods=['POST', 'GET'])
def game():
    if request.method == 'POST':
        try:
            session['player1'] = request.form['player[1]']
            session['player2'] = request.form['player[2]']
            return render_template('game.html', get_character_player1=escape(session['player1']),
                                   get_character_player2=escape(session['player2']))
        except werkzeug.exceptions.BadRequestKeyError:
            error_message = "Each player has to select a character"
            return redirect(url_for('menu'))
    else:
        return redirect(url_for('menu'))


# Remove sessions and quit to title
@app.route('/quit', methods=['POST', 'GET'])
def quit_game():
    session.pop('player1', None)
    session.pop('player2', None)
    return redirect(url_for('menu'))


# Route to files
# Favicons
@app.route('/favicon')
def fav():
    return send_from_directory(os.path.join(app.root_path, 'docs/img/favicon'), 'Bomb_1_small.png')
# =============================================================================================


# JavaScripts
@app.route('/main.js')
def game_script():
    return send_from_directory(os.path.join(app.root_path, 'templates/js'), 'main.js')
# =============================================================================================


# Stylesheets
@app.route('/style.css')
def game_stylesheet():
    return send_from_directory(os.path.join(app.root_path, 'templates/css'), 'style.css')


@app.route('/style_menu.css')
def menu_stylesheet():
    return send_from_directory(os.path.join(app.root_path, 'templates/css'), 'style_menu.css')
# =============================================================================================


# Characters
@app.route('/image1')
def image1():
    return send_from_directory(os.path.join(app.root_path, 'docs/img/designs'), 'c1_test.png')


@app.route('/image2')
def image2():
    return send_from_directory(os.path.join(app.root_path, 'docs/img/designs'), 'c2_test.png')


@app.route('/image3')
def image3():
    return send_from_directory(os.path.join(app.root_path, 'docs/img/designs'), 'c3_test.png')
# =============================================================================================


# Secret Key (Must be kept secret)
app.secret_key = "\xec\x82\x16E\xb0\xe9\xec3\xccG\xe7\xd4&b\x92\t\x13\xce(\x8a\x80\xa0\xe9x"


# App Startup (port 2020) Turn debug=False at end of development
if __name__ == '__main__':
    app.run(port=2020, debug=True)


# Responsible Person: David Abderhalden
# Repository: BombAway
# Copyright ©
