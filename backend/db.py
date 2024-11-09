import os

import config

def setup():
    if not os.path.isdir(config.USERS_DIR):
        os.makedirs(config.USERS_DIR)
    if not os.path.isdir(config.DOCS_DIR):
        os.makedirs(config.DOCS_DIR)


def user_dir_path(username) -> str:
    return f"{config.USERS_DIR}/{username}"


def user_password_get_path(username) -> str:
    return f"{user_dir_path(username)}/{config.PASSWORD_FILE}"


def user_dir_exists(username) -> bool:
    return os.path.isdir(f"{user_dir_path(username)}")


def user_dir_make(username):
    os.makedirs(user_dir_path(username))


def user_password_get(username) -> str:
    if not user_dir_exists(username):
        raise Exception("Пользователь не существует")
    with open(user_password_get_path(username), "r") as password_file:
        return password_file.read()


def user_password_set(username: str, password: str):
    if not user_dir_exists(username):
        raise Exception("Пользователь не существует")
    with open(f"{user_password_get_path(username)}", "w") as password_file:
        password_file.write(password)


def user_history_dir_path(username: str):
    return f"{user_dir_path(username)}/{config.HISTORY_DIR}"


def user_history_dir_exists(username: str):
    return os.path.isdir(user_history_dir_path(username))


def user_history_dir_make(username):
    os.makedirs(user_history_dir_path(username))


def user_history_entry_path(username: str, entry: str):
    return f"{user_history_dir_path(username)}/{entry}"


def user_history_entry_exists(username: str, entry: str):
    return os.path.isfile(user_history_entry_path(username, entry))


def user_history_entry_ls(username):
    return os.listdir(user_history_dir_path(username))


def user_history_entry_get(username: str, entry: str):
    if not user_dir_exists(username):
        raise Exception("Пользователь не существует")
    if not user_history_entry_exists(username, entry):
        raise Exception("Файла истории не существует")
    with open(user_history_entry_path(username, entry), "r", encoding='utf-8') as history_file:
        return history_file.read()
    

def user_history_entry_set(username: str, entry: str, data: str):
    if not user_dir_exists(username):
        raise Exception("Пользователь не существует")
    with open(user_history_entry_path(username, entry), "w", encoding='utf-8') as history_file:
        history_file.write(data)

