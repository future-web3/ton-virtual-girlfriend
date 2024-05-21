import utils as U
from importlib import resources

def load_prompt(prompt):
    with resources.path("prompts", f"{prompt}.txt") as prompt_path:
        return U.load_text(str(prompt_path))

def load_role(role):
    valid_roles = ["maid", "poet", "rapper", "manager"]
    if role not in valid_roles:
        return 'poet'
    return role
