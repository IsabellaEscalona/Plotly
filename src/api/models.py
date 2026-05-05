from flask_sqlalchemy import SQLAlchemy
import enum
from sqlalchemy import String, Boolean, Enum
from sqlalchemy.orm import Mapped, mapped_column

db = SQLAlchemy()

follower = db.Table(
    'followers',
    db.Column('users_followed', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('users_follower', db.Integer, db.ForeignKey('users.id'), primary_key=True)
)


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    email = db.Column(db.String(180), nullable=False, unique=True)
    password = db.Column(db.String(180), nullable=False)

    perfil = db.relationship('Profile', backref='user', uselist=False)

    Post = db.relationship('Post', backref='author')


    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            'username': self.username
            # do not serialize the password, its a security breach
        }


class Enum_Artist(enum.Enum):
    COMIC_ARTIST = 'comic artist'
    WRITER = 'writer'
    HYBRID = 'hybrid'
    READER = 'reader'


class Profile(db.Model):
    __tablename__ = 'profiles'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    profile_picture = db.Column(db.String(250))
    bio = db.Column(db.String(500))
    artist_type = db.Column(db.Enum(Enum_Artist), default=Enum_Artist.READER)
    instagram = db.Column(db.String(180))
    twitter = db.Column(db.String(180))
    facebook = db.Column(db.String(180))
    otros = db.Column(db.String(180))

class Enum_Category_Post(enum.Enum):
    ONLY_TEXT = 'only text'
    COMIC = 'comic'

class Post(db.Model):
    __tablename__ = 'posts'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    title = db.Column(db.String(200))
    category = db.Column(db.Enum(Enum_Category_Post), nullable=False)
    description = db.Column(db.String(1000))

    content = db.relationship('Content_Post', backref='post')

    comment = db.relationship('Comment', backref='post')
    
    like = db.relationship('Like', backref='post')



class Enum_Type_Media(enum.Enum):
    GIF = 'gif'
    IMAGE = 'image'
    VIDEO = 'video'
    TEXT = 'text'

class Content_Post(db.Model):
    __tablename__ = 'contents_posts'
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
    type = db.Column(db.Enum(Enum_Type_Media))
    url = db.Column(db.String(200))

class Comment(db.Model):
    __tablename__ = 'comments'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
    content = db.Column(db.String(1000))

class Like(db.Model):
    __tablename__ = 'Likes'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
    liked = db.Column(db.Boolean, default=False)