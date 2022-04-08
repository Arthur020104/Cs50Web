from django.db.models import Max
from django.test import Client, TestCase

from .models import User, Posts, UserPerfil
# Create your tests here.
class Users(TestCase):

    def setUp(self):
        
        
        u1 = User.objects.create_user(username="test1", email="test1@gmail.com",password="1234")
        UserPerfil.objects.create(pk=u1.id)
        u2 = User.objects.create_user(username="test2", email="test2@gmail.com",password="1234")
        UserPerfil.objects.create(pk=u2.id)
        u3 = User.objects.create_user(username="test3", email="test3@gmail.com",password="1234")
        UserPerfil.objects.create(pk=u3.id)

    def test_followers(self):
        
        user1 = User.objects.get(username="test1")
        user = User.objects.get(username="test2")
        profile = user1.profile
        user2 = User.objects.get(username="test3")
        profile.followers.add(user2,user)
        self.assertEqual(profile.followers.count(),2)
