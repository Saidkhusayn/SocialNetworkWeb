from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, get_object_or_404
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
import json

from .models import *


def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
    
@csrf_exempt
def posts(request):
    if request.method == "POST":
        data = json.loads(request.body)
        content = data.get('content', '')

        if content:
            post = Post(user=request.user, content=content)
            post.save()
            return JsonResponse({"message": "Post created successfully"}, status=201)
        else:
            return JsonResponse({"error": "Content cannot be empty"}, status=400)
    else:
        return JsonResponse({"error": "POST request required"}, status=400)
    
def allposts(request):
    posts = Post.objects.all().order_by('-timestap')
    return render(request, "network/allposts.html", {
        'posts': posts
    })

def profile(request, username):
    user = get_object_or_404(User, username=username)
    follower_count = user.follower_count() 
    following_count = user.following_count() 
    posts = Post.objects.filter(user=user).order_by('-timestap')
    return render(request, 'network/profile.html', {
        'posts': posts,
        'postUser': user,
        'follower_count': follower_count,
        'following_count': following_count,
    })