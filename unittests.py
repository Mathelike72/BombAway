import unittest
from main import app
from flask import jsonify




class BasicTests(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        app.config['DEBUG'] = False
        self.app = app.test_client()

    def tearDown(self):
        pass


    # Main Menu wird aufgerufen
    def test_main_menu_route(self):
        response = self.app.get('/', follow_redirects=False)
        self.assertEqual(response.status_code, 200)

    # Ohne Payload redirects off (Error Redirect_found)
    def test_no_payload(self):
        response = self.app.get('/play', follow_redirects=False)
        self.assertEqual(response.status_code, 302)

    # Ohne Payload returnt zu Main Menu (redirects on)
    def test_no_payload_redirect(self):
        response = self.app.get('/play', follow_redirects=True)
        self.assertEqual(response.status_code, 200)

    # Mit Payload startet Spiel
    def test_payload_game(self):
        response = self.app.post('/play', content_type='multipart/form-data', follow_redirects=False,
                                 data={'player[1]': 'character1',
                                       'player[2]': 'character3',
                                       'name[1]': 'Testname1',
                                       'name[2]': 'Testname2'})
        self.assertEqual(response.status_code, 200)

    # Payload ohne definierte Namen redirectet auf Main Menu
    def test_payload_without_name(self):
        response = self.app.post('/play', content_type='multipart/form-data', follow_redirects=False,
                                 data={'player[1]': 'character1',
                                       'player[2]': 'character3'})
        self.assertEqual(response.status_code, 302)

    # Player won without Sessions (redirect to Main Menu)
    def test_player_won_without_session(self):
        response = self.app.get('/player_1_won', follow_redirects=False)
        self.assertEqual(response.status_code, 302)


# ___________________________________________RESOURCES_______________________________________________

    def test_get_favicon(self):
        response = self.app.get('/favicon', follow_redirects=False)
        self.assertTrue(response is not None)

    def test_get_js(self):
        response = self.app.get('/bomb.js', follow_redirects=False)
        self.assertTrue(response is not None)

    def test_get_style1(self):
        response = self.app.get('/style.css', follow_redirects=False)
        self.assertTrue(response is not None)

    def test_get_style2(self):
        response = self.app.get('/style_menu.css', follow_redirects=False)
        self.assertTrue(response is not None)

    def test_get_style3(self):
        response = self.app.get('/style_game_over.css', follow_redirects=False)
        self.assertTrue(response is not None)

    def test_get_hwall(self):
        response = self.app.get('/hardWall', follow_redirects=False)
        self.assertTrue(response is not None)

    def test_get_swall(self):
        response = self.app.get('/softWall', follow_redirects=False)
        self.assertTrue(response is not None)

    def test_get_bg(self):
        response = self.app.get('/background', follow_redirects=False)
        self.assertTrue(response is not None)

    def test_get_up(self):
        response = self.app.get('/upGrade1', follow_redirects=False)
        self.assertTrue(response is not None)

    def test_get_img1(self):
        response = self.app.get('/image1', follow_redirects=False)
        self.assertTrue(response is not None)

    def test_get_img2(self):
        response = self.app.get('/image2', follow_redirects=False)
        self.assertTrue(response is not None)

    def test_get_img3(self):
        response = self.app.get('/image3', follow_redirects=False)
        self.assertTrue(response is not None)

# Weitere Tests:
# Sessions werden gespeichert
# Server Terminate
# Server dump


if __name__ == '__main__':
    unittest.main()
