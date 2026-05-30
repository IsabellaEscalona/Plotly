from flask_sqlalchemy import SQLAlchemy
import enum
from sqlalchemy import String, Boolean, Enum
from sqlalchemy.orm import Mapped, mapped_column
from werkzeug.security import generate_password_hash

db = SQLAlchemy()

follower = db.Table(
    'followers',
    db.Column('users_followed', db.Integer,

              db.ForeignKey('users.id'), primary_key=True),
    db.Column('users_follower', db.Integer,

              db.ForeignKey('users.id'), primary_key=True)
)


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    email = db.Column(db.String(180), nullable=False, unique=True)
    password = db.Column(db.String(180), nullable=False)

    perfil = db.relationship('Profile', backref='user', uselist=False)

    Post = db.relationship('Post', backref='author')

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            'username': self.username
            # do not serialize the password, its a security breach
        }


class Enum_Artist(enum.Enum):
    COMIC_ARTIST = 'comic artist'
    WRITER = 'Writer'
    HYBRID = 'Hybrid'
    READER = 'Reader'


TIPO_MAP = {
    Enum_Artist.COMIC_ARTIST: 'Artista',
    Enum_Artist.WRITER: 'Artista',
    Enum_Artist.HYBRID: 'Artista',
    Enum_Artist.READER: 'Lector'
}


class Profile(db.Model):
    __tablename__ = 'profiles'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    profile_picture = db.Column(db.String(250), default=None)
    bio = db.Column(db.String(500), default=None)
    artist_type = db.Column(db.Enum(Enum_Artist), default=Enum_Artist.READER)
    instagram = db.Column(db.String(180), default=None)
    twitter = db.Column(db.String(180), default=None)
    facebook = db.Column(db.String(180),  default=None)
    otros = db.Column(db.String(180),  default=None)

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "profile_picture": self.profile_picture,
            "bio": self.bio,
            "artist_type": self.artist_type.value if self.artist_type else None,
            "tipo": TIPO_MAP.get(self.artist_type, 'Lector') if self.artist_type else None,
            "instagram": self.instagram,
            "twitter": self.twitter,
            "facebook": self.facebook,
            "otros": self.otros
            # do not serialize the password, its a security breach
        }


class Enum_Category_Post(enum.Enum):
    ONLY_TEXT = 'only text'
    COMIC = 'comic'


class Enum_Genre_post(enum.Enum):
    ACCION = 'Accion'
    ROMANCE = 'Romance'
    TERROR = 'Terror'
    FANTASIA = 'Fantasia'
    SCIFI = 'Sci-Fi'


class Post(db.Model):
    __tablename__ = 'posts'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    title = db.Column(db.String(200), nullable=False)
    category = db.Column(db.Enum(Enum_Category_Post), nullable=False)
    principal_genre = db.Column(db.Enum(Enum_Genre_post), nullable=False)
    secondary_genre = db.Column(db.Enum(Enum_Genre_post))
    description = db.Column(db.String(1000))
    cover = db.Column(db.String(200))

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            'title': self.title,
            'category': self.category.value if self.category else None,
            'principal_genre': self.principal_genre.value if self.principal_genre else None,
            'secondary_genre': self.secondary_genre.value if self.secondary_genre else None,
            'description': self.description,
            'cover': self.cover
            # do not serialize the password, its a security breach
        }

    content = db.relationship('Content_Post', backref='post')

    comment = db.relationship('Comment', backref='post')

    like = db.relationship('Like', backref='post')

    saved = db.relationship('Saved', backref='post')


class Content_Post(db.Model):
    __tablename__ = 'contents_posts'
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
    url = db.Column(db.String(200), nullable=False)


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

class Saved(db.Model):
    __tablename__ = 'saved'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))

    __table_args__ = (
        db.UniqueConstraint('user_id', 'post_id', name='uq_user_post_saved'),
    )

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "post_id": self.post_id
        }