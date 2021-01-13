import werkzeug
from flask import Flask, request, render_template, escape, session, redirect, url_for, send_from_directory, jsonify
import os
import webbrowser

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
            session['name1'] = request.form['name[1]']
            session['name2'] = request.form['name[2]']
            if session['name1'] and session['name2']:
                return render_template('game.html',
                                       get_character_player1=escape(session['player1']),
                                       get_character_player2=escape(session['player2']),
                                       get_name_player1=escape(session['name1']),
                                       get_name_player2=escape(session['name2']),
                                       )
            else:
                return redirect(url_for('menu'))

        except werkzeug.exceptions.BadRequestKeyError:
            return redirect(url_for('menu'))
    else:
        try:
            return render_template('game.html',
                                   get_character_player1=escape(session['player1']),
                                   get_character_player2=escape(session['player2']),
                                   get_name_player1=escape(session['name1']),
                                   get_name_player2=escape(session['name2']),
                                   )
        except KeyError:
            return redirect(url_for('menu'))


# Remove sessions and quit to title
@app.route('/back/menu')
def back_to_title_screen():
    session.pop('player1', None)
    session.pop('player2', None)
    session.pop('name1', None)
    session.pop('name2', None)
    return redirect(url_for('menu'))


# Remove sessions and shut down Server
def shutdown_server():
    session.pop('player1', None)
    session.pop('player2', None)
    session.pop('name1', None)
    session.pop('name2', None)
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()


@app.route('/terminate', methods=['GET'])
def shutdown():
    shutdown_server()
    return jsonify({'termination': 'True', 'sessions': 'removed', })


# Remove all sessions
@app.route('/dump')
def dump_sessions():
    session.pop('player1', None)
    session.pop('player2', None)
    session.pop('name1', None)
    session.pop('name2', None)
    return redirect(url_for('menu'))


# Player 1 won
@app.route('/player_1_won')
def player_1_won():
    try:
        return render_template('player_1_won.html', name=session['name1'])
    except KeyError:
        return redirect(url_for('menu'))


# Player 2 won
@app.route('/player_2_won')
def player_2_won():
    try:
        return render_template('player_2_won.html', name=session['name2'])
    except KeyError:
        return redirect(url_for('menu'))


# Route to files
# Favicons
@app.route('/favicon')
def fav():
    return send_from_directory(os.path.join(app.root_path, 'docs/img/favicon'), 'Bomb_1_small.png')


# =============================================================================================


# JavaScripts
@app.route('/bomb.js')
def game_script():
    return send_from_directory(os.path.join(app.root_path, 'templates/js'), 'bomb.js')


# =============================================================================================


# Stylesheets
@app.route('/style.css')
def game_stylesheet():
    return send_from_directory(os.path.join(app.root_path, 'templates/css'), 'style.css')


@app.route('/style_menu.css')
def menu_stylesheet():
    return send_from_directory(os.path.join(app.root_path, 'templates/css'), 'style_menu.css')


@app.route('/style_game_over.css')
def game_over_stylesheet():
    return send_from_directory(os.path.join(app.root_path, 'templates/css'), 'style_game_over.css')


# =============================================================================================


# Images
@app.route('/hardWall')
def hard_wall():
    return send_from_directory(os.path.join(app.root_path, 'docs/img/designs'), 'hardWall.png')


@app.route('/softWall')
def soft_wall():
    return send_from_directory(os.path.join(app.root_path, 'docs/img/designs'), 'softWall.png')


@app.route('/background')
def background():
    return send_from_directory(os.path.join(app.root_path, 'docs/img/designs'), 'background.png')


@app.route('/upGrade1')
def up_grade():
    return send_from_directory(os.path.join(app.root_path, 'docs/img/designs'), 'upGrade1.png')


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
    webbrowser.open('http://localhost:2020')
    app.run(port=2020, debug=False)              # SET DEBUG TO FALSE BEFORE DEPLOYMENT!

# Responsible Person: David Abderhalden
# Repository: BombAway
# Copyright ©
