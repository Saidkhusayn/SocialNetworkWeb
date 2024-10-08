
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
    
    #API routes
    path("posts", views.posts, name='posts'),
    path('profile/edit/<int:post_id>', views.edit, name='edit'),
    path('post/like/<int:post_id>', views.like, name='like'),
    
]
