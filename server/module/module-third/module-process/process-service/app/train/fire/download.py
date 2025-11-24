from roboflow import Roboflow
rf = Roboflow(api_key="6KooJJhAkJVREkrahwA5")
project = rf.workspace("test-vpwxw").project("fire-iv0ee-la3km")
version = project.version(1)
dataset = version.download("yolov11")
