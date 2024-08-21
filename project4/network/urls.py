
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("allposts", views.allposts, name="allposts"),
    path('profile/<str:username>', views.profile, name='profile'),
    path('following', views.following, name='following'),
    path('profile/edit/<int:post_id>', views.edit, name='edit'),

    #API routes
    path("posts", views.posts, name='posts'),
]
