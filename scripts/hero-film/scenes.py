"""StationByte loop scenes: short, seamless, path-traced clips of the brand tiles (Blender Cycles).

Render one scene (from the repo root):
  /Applications/Blender.app/Contents/MacOS/Blender -b -P scripts/hero-film/scenes.py -- \
      --scene ai --out .render/loops/ai/f [--frames 1-36] [--samples 12] [--res 100]
Then encode with scripts/hero-film/encode-loops.sh (or run scripts/hero-film/render-loops.sh for all).

Scenes
  ai, saas, apps, design   dark glass and graphite, one per service (square)
  contact                  ceramic grid, the blue tile settling into the open slot (4:5)
  studio                   ceramic stacks under drifting window light (4:5)
  process                  four stacks growing into the full grid, slow dolly (16:9)

Every animated value is periodic over LOOP frames, so frame LOOP+1 equals frame 1 and the
clips loop in the browser without a cut. Kept short and small on purpose: the page loops them.
"""

import math
import random
import sys

import bpy
from mathutils import Euler, Vector

argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []


def arg(name, default):
    return argv[argv.index(f"--{name}") + 1] if f"--{name}" in argv else default


SCENE = arg("scene", "ai")
OUT = arg("out", f"//{SCENE}/f")
# 3 s per loop, rendered at 12 fps; encode-loops.sh interpolates to 24 fps. Half the frames, same motion.
LOOP = int(arg("loop", "36"))
FPS = int(arg("fps", "12"))
FRAMES = arg("frames", f"1-{LOOP}")
SAMPLES = int(arg("samples", "12"))
RES = int(arg("res", "100"))
GLASS = SCENE in ("ai", "saas", "apps", "design")
SIZE = {"contact": (720, 900), "studio": (720, 900), "process": (1024, 576)}.get(SCENE, (720, 720))
TAU = 2 * math.pi

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.fps = FPS
scene.frame_start, scene.frame_end = 1, LOOP


def hex_rgba(h, a=1.0):
    h = h.lstrip("#")
    srgb = [int(h[i : i + 2], 16) / 255 for i in (0, 2, 4)]
    lin = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in srgb]
    return (*lin, a)


def principled(name, **inputs):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    for key, value in inputs.items():
        bsdf.inputs[key].default_value = value
    return mat, bsdf


def periodic(fn, step=3):
    """Call fn(frame, t) on a grid of frames covering one loop and its closing frame; t runs 0 → 1."""
    for f in range(1, LOOP + 2, step):
        fn(f, (f - 1) / LOOP)


def smooth_all():
    for obj in bpy.data.objects:
        ad = obj.animation_data
        if ad and ad.action:
            for fc in ad.action.fcurves:
                for k in fc.keyframe_points:
                    k.interpolation = "BEZIER"


# ---------------------------------------------------------------- materials
if GLASS:
    glass, _ = principled("Glass", **{"Base Color": hex_rgba("#f2f4ff"), "Transmission Weight": 1.0, "Roughness": 0.08, "IOR": 1.5,
                                       "Coat Weight": 0.6, "Coat Roughness": 0.05})
    frost, _ = principled("Frosted", **{"Base Color": hex_rgba("#eef0ff"), "Transmission Weight": 1.0, "Roughness": 0.32, "IOR": 1.45})
    graphite, _ = principled("Graphite", **{"Base Color": hex_rgba("#1b1b20"), "Metallic": 0.7, "Roughness": 0.4, "Coat Weight": 1.0,
                                             "Coat Roughness": 0.08})
    core, core_bsdf = principled("Core", **{"Base Color": hex_rgba("#2438e6"), "Roughness": 0.3, "Emission Color": hex_rgba("#3046ff"),
                                            "Emission Strength": 2.0, "Coat Weight": 0.5, "Coat Roughness": 0.1})
    floor_mat, _ = principled("Floor", **{"Base Color": hex_rgba("#050506"), "Roughness": 0.18, "Specular IOR Level": 0.6})
    MATS = {"g": glass, "f": frost, "k": graphite, "c": core}
else:
    ceramic, _ = principled("Ceramic", **{"Base Color": hex_rgba("#ece9e3"), "Roughness": 0.42, "Coat Weight": 0.25, "Coat Roughness": 0.25})
    cobalt, _ = principled("Cobalt glaze", **{"Base Color": hex_rgba("#1f33d6"), "Roughness": 0.12, "Coat Weight": 1.0, "Coat Roughness": 0.02})
    MATS = {"w": ceramic, "c": cobalt}
    # Linen: pale, with a fine woven bump so the light has something to rake across.
    floor_mat = bpy.data.materials.new("Linen")
    floor_mat.use_nodes = True
    nt = floor_mat.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = hex_rgba("#e7e3db")
    bsdf.inputs["Roughness"].default_value = 0.92
    noise = nt.nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 260.0
    noise.inputs["Detail"].default_value = 2.0
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.12
    nt.links.new(noise.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])


def tile(name, loc, size=(1.0, 0.42, 1.0), mat="g", rot=(0, 0, 0), bevel=0.16):
    bpy.ops.mesh.primitive_cube_add(size=1)
    t = bpy.context.active_object
    t.name = name
    t.scale = size
    bpy.ops.object.transform_apply(scale=True)
    b = t.modifiers.new("Bevel", "BEVEL")
    b.width, b.segments, b.limit_method = min(bevel, min(size) * 0.45), 8, "NONE"
    bpy.ops.object.shade_smooth()
    t.data.materials.append(MATS[mat])
    t.location = loc
    t.rotation_euler = [math.radians(a) for a in rot]
    return t


def float_obj(obj, dz=0.0, rz=0.0, rx=0.0, phase=0.0):
    """Gentle periodic float: lift and turn, returning exactly to the start each loop."""
    base_loc, base_rot = obj.location.copy(), obj.rotation_euler.copy()

    def key(f, t):
        s = math.sin(TAU * (t + phase))
        obj.location = base_loc + Vector((0, 0, dz * s))
        obj.rotation_euler = Euler((base_rot.x + math.radians(rx) * s, base_rot.y, base_rot.z + math.radians(rz) * s))
        obj.keyframe_insert("location", frame=f)
        obj.keyframe_insert("rotation_euler", frame=f)

    periodic(key)


STEP = 1.22
LAYOUT = [["g", "k", "g"], ["f", "c", "k"], ["g", "k", None]]

look = Vector((0, 0, 1.6))
cam_loc = Vector((-6.5, -11.5, 3.2))
lens, orbit, lift = 56, 4.0, 0.15

# ---------------------------------------------------------------- compositions
if SCENE == "ai":
    for r in range(3):
        for c in range(3):
            if LAYOUT[r][c]:
                tile(f"t{r}{c}", ((c - 1) * STEP, 0, (1 - r) * STEP + 1.72), mat=LAYOUT[r][c])
    # The core breathes once per loop.
    periodic(lambda f, t: (core_bsdf.inputs["Emission Strength"].__setattr__("default_value", 2.4 + 0.9 * math.sin(TAU * t)),
                           core_bsdf.inputs["Emission Strength"].keyframe_insert("default_value", frame=f)))
    look, cam_loc, lens = Vector((0, 0, 1.72)), Vector((-3.4, -11.2, 2.3)), 74
elif SCENE == "saas":
    for layer, (z, mats) in enumerate([(0.3, "kkk"), (1.55, "kfk"), (2.8, "ggf")]):
        for r in range(3):
            for c in range(3):
                if layer == 2 and (r, c) == (2, 2):
                    continue
                m = "c" if (layer == 1 and (r, c) == (1, 1)) else mats[(r + c) % 3]
                t = tile(f"l{layer}{r}{c}", ((c - 1) * STEP, (r - 1) * STEP, z), size=(1.0, 1.0, 0.26), mat=m, bevel=0.12)
                # The layers breathe apart and settle: top rises, bottom sinks, each tile slightly out of step.
                float_obj(t, dz=(0.22, 0.05, -0.12)[2 - layer], phase=(r * 3 + c) * 0.015)
    look, cam_loc, lens = Vector((0, 0, 1.5)), Vector((-8.4, -11.2, 5.6)), 66
elif SCENE == "apps":
    browser = tile("browser", (-0.9, 0.5, 1.75), size=(4.4, 0.3, 2.9), mat="f", bevel=0.22)
    phone = tile("phone", (2.35, -0.6, 1.45), size=(1.45, 0.3, 2.9), mat="g", bevel=0.3)
    for i, (x, z, m) in enumerate([(-2.3, 2.45, "k"), (-1.05, 2.45, "k"), (0.2, 2.45, "c"), (-2.3, 1.2, "g"), (-1.05, 1.2, "k")]):
        tile(f"w{i}", (x, 0.18, z), size=(1.0, 0.3, 1.0), mat=m, bevel=0.14).parent = browser
    for i, (z, m) in enumerate([(2.15, "c"), (0.95, "k")]):
        tile(f"p{i}", (2.35, -0.92, z), size=(1.0, 0.3, 1.0), mat=m, bevel=0.14).parent = phone
    # Children were placed in world space; keep them there after parenting.
    bpy.context.view_layer.update()
    for obj in list(browser.children) + list(phone.children):
        obj.matrix_parent_inverse = obj.parent.matrix_world.inverted()
    float_obj(phone, dz=0.18, rz=5)
    float_obj(browser, dz=0.06, rz=-1.5, phase=0.5)
    look, cam_loc, lens = Vector((0.45, 0, 1.6)), Vector((-4.0, -12.6, 2.7)), 58
elif SCENE == "design":
    random.seed(7)
    for r in range(3):
        for c in range(3):
            if not LAYOUT[r][c]:
                continue
            z = 1.4 + random.uniform(-0.7, 1.1)
            t = tile(f"d{r}{c}", ((c - 1) * 1.4, (r - 1) * 1.4, z), size=(1.0, 1.0, 0.26), mat=LAYOUT[r][c],
                     rot=(random.uniform(-14, 14), random.uniform(-14, 14), random.uniform(-20, 20)), bevel=0.12)
            float_obj(t, dz=0.22, rz=6, rx=5, phase=random.random())
    look, cam_loc, lens = Vector((0, 0, 1.45)), Vector((-6.2, -8.2, 5.4)), 70
elif SCENE == "contact":
    # Eight ceramic tiles flat on linen; the cobalt one settles into the open slot and lifts again.
    P = 1.16
    for r in range(3):
        for c in range(3):
            if (r, c) == (2, 2):
                continue
            tile(f"c{r}{c}", ((c - 1) * P, (1 - r) * P, 0.14), size=(1.0, 1.0, 0.28), mat="w", bevel=0.2)
    blue = tile("blue", (P, -P, 0.14), size=(1.0, 1.0, 0.28), mat="c", bevel=0.2)

    def drop(f, t):
        h = 0.5 + 0.5 * math.cos(TAU * t)  # 1 at the loop's start and end, 0 halfway: hovering → seated → hovering
        blue.location = Vector((P, -P, 0.14 + 0.62 * h))
        blue.rotation_euler = Euler((math.radians(4 * h), math.radians(-3 * h), math.radians(-9 * h)))
        blue.keyframe_insert("location", frame=f)
        blue.keyframe_insert("rotation_euler", frame=f)

    periodic(drop, step=2)
    look, cam_loc, lens, orbit, lift = Vector((0.0, -0.05, 0.2)), Vector((-2.2, -6.8, 8.2)), 64, 2.0, 0.08
elif SCENE == "studio":
    # Ceramic stacks of one to three tiles in the grid, the cobalt tile on the tallest; the slot stays open.
    P = 1.3
    heights = [[1, 1, 3], [2, 1, 1], [1, 2, 0]]
    for r in range(3):
        for c in range(3):
            for k in range(heights[r][c]):
                top = k == heights[r][c] - 1
                m = "c" if (r, c) == (0, 2) and top else "w"
                tile(f"s{r}{c}{k}", ((c - 1) * P, (1 - r) * P, 0.14 + k * 0.3), size=(1.0, 1.0, 0.28), mat=m, bevel=0.2)
    look, cam_loc, lens, orbit, lift = Vector((0.1, 0.1, 0.4)), Vector((-3.6, -8.2, 4.6)), 62, 2.5, 0.1
elif SCENE == "process":
    # Four stacks left to right: one tile, two, four, then the full grid with the cobalt core.
    xs = [-3.9, -2.4, -0.8, 1.2]
    tile("p0", (xs[0], 0, 0.14), size=(1.0, 1.0, 0.28), mat="w", bevel=0.2)
    for k in range(2):
        tile(f"p1{k}", (xs[1], 0, 0.14 + k * 0.3), size=(1.0, 1.0, 0.28), mat="w", bevel=0.2)
    for k in range(4):
        tile(f"p2{k}", (xs[2], 0, 0.14 + k * 0.3), size=(1.0, 1.0, 0.28), mat="w", bevel=0.2)
    P = 0.62
    for r in range(3):
        for c in range(3):
            if (r, c) == (2, 2):
                continue
            tile(f"g{r}{c}", (xs[3] + (c - 1) * P + 0.6, (1 - r) * P, 0.1), size=(0.54, 0.54, 0.2), mat="c" if (r, c) == (1, 1) else "w", bevel=0.12)
    look, cam_loc, lens, orbit, lift = Vector((-0.9, 0, 0.3)), Vector((-1.3, -8.6, 3.2)), 42, 3.0, 0.06

# ---------------------------------------------------------------- floor and world
bpy.ops.mesh.primitive_plane_add(size=400, location=(0, 0, 0))
bpy.context.active_object.data.materials.append(floor_mat)

world = bpy.data.worlds.new("World")
scene.world = world
world.use_nodes = True
bg = world.node_tree.nodes["Background"]
bg.inputs["Color"].default_value = hex_rgba("#020203" if GLASS else "#efece6")
bg.inputs["Strength"].default_value = 1.0 if GLASS else 0.45


def area(name, loc, size, energy, color="#ffffff", size_y=None, glossy=True, target=None):
    data = bpy.data.lights.new(name, "AREA")
    data.shape = "RECTANGLE"
    data.size, data.size_y = size, size_y or size
    data.energy = energy
    data.color = hex_rgba(color)[:3]
    obj = bpy.data.objects.new(name, data)
    obj.location = loc
    obj.visible_camera = False
    obj.visible_glossy = glossy
    scene.collection.objects.link(obj)
    obj.rotation_euler = ((target or look) - obj.location).to_track_quat("-Z", "Y").to_euler()
    return obj


tiles = [o for o in scene.collection.objects if o.type == "MESH" and o.data.materials and o.data.materials[0] is not floor_mat]

if GLASS:
    area("Key", (-5.5, -5.0, 6.5), 7.0, 320, size_y=4.0)
    rim = area("Rim", (6.0, 4.0, 4.0), 0.5, 240, "#a9b4ff", size_y=6.0)
    area("Back", (2.6, 5.5, 3.4), 7.0, 50, "#dfe5ff", size_y=4.0, glossy=False)
    area("Top", (0, -1.0, 8.0), 6.0, 60, glossy=False)
    # A narrow strip crosses the set once per loop, fading in and out so the loop point is invisible.
    sweep = area("Sweep", (-7, -6.5, 3.0), 0.25, 0, size_y=7.0)
    receivers = bpy.data.collections.new("Tiles")
    for o in tiles:
        receivers.objects.link(o)
    rim.light_linking.receiver_collection = receivers
    sweep.light_linking.receiver_collection = receivers

    def sweep_key(f, t):
        sweep.location.x = -7 + 14 * t
        sweep.rotation_euler = (look - sweep.location).to_track_quat("-Z", "Y").to_euler()
        sweep.data.energy = 420 * math.sin(math.pi * t) ** 2
        sweep.keyframe_insert("location", frame=f)
        sweep.keyframe_insert("rotation_euler", frame=f)
        sweep.data.keyframe_insert("energy", frame=f)

    periodic(sweep_key, step=2)
    core_tile = next((o for o in tiles if o.data.materials[0] is core), None)
    if core_tile:
        spill_data = bpy.data.lights.new("Spill", "POINT")
        spill_data.energy, spill_data.color, spill_data.shadow_soft_size = (180 if SCENE == "ai" else 70), hex_rgba("#3046ff")[:3], 0.5
        spill = bpy.data.objects.new("Spill", spill_data)
        spill.location = core_tile.matrix_world.translation + Vector((0, 0.6, 0))
        scene.collection.objects.link(spill)
else:
    # Morning sun through a window: the frame's shadow falls across the tiles and drifts slowly.
    sun_data = bpy.data.lights.new("Sun", "SUN")
    sun_data.energy, sun_data.angle, sun_data.color = 3.4, math.radians(4.5), hex_rgba("#fff1df")[:3]
    sun = bpy.data.objects.new("Sun", sun_data)
    sun.rotation_euler = Euler((math.radians(48), 0, math.radians(-38)))
    scene.collection.objects.link(sun)
    sun_dir = sun.rotation_euler.to_matrix() @ Vector((0, 0, -1))
    gobo = bpy.data.objects.new("Window", None)
    scene.collection.objects.link(gobo)
    gobo.location = look - sun_dir * 4.5
    gobo.rotation_euler = sun_dir.to_track_quat("-Z", "Y").to_euler()
    for i, (sx, sy, x, y) in enumerate([(0.1, 9, -1.6, 0), (0.08, 9, 0.2, 0), (9, 0.08, 0, 1.1)]):
        bpy.ops.mesh.primitive_cube_add(size=1)
        bar = bpy.context.active_object
        bar.scale = (sx, sy, 0.05)
        bar.location = (x, y, 0)
        bar.parent = gobo
        bar.visible_camera = False
        bar.visible_glossy = False
    drift = {"studio": 0.9, "process": 0.6, "contact": 0.35}[SCENE]

    def gobo_key(f, t):
        gobo.location = look - sun_dir * 4.5 + Vector((drift * math.sin(TAU * t), drift * 0.4 * math.cos(TAU * t), 0))
        gobo.keyframe_insert("location", frame=f)

    periodic(gobo_key)
    area("Fill", (0.5, -6.0, 4.0), 8.0, 130, "#f4f1ec", glossy=False)
    area("Bounce", (4.5, 3.0, 2.5), 5.0, 40, "#fffaf2", glossy=False)

# ---------------------------------------------------------------- camera: a small periodic orbit and lift
cam_data = bpy.data.cameras.new("Camera")
cam_data.lens = lens
cam_data.dof.use_dof = True
cam_data.dof.aperture_fstop = 2.8 if GLASS else 3.5
cam = bpy.data.objects.new("Camera", cam_data)
scene.collection.objects.link(cam)
scene.camera = cam
focus = bpy.data.objects.new("Focus", None)
focus.location = look
scene.collection.objects.link(focus)
cam_data.dof.focus_object = focus
offset = cam_loc - look


def cam_key(f, t):
    yaw = math.radians(orbit) * math.sin(TAU * t)
    rotated = Vector((offset.x * math.cos(yaw) - offset.y * math.sin(yaw), offset.x * math.sin(yaw) + offset.y * math.cos(yaw), offset.z))
    cam.location = look + rotated + Vector((0, 0, lift * math.sin(TAU * t + 0.8)))
    cam.rotation_euler = (look - cam.location).to_track_quat("-Z", "Y").to_euler()
    cam.keyframe_insert("location", frame=f)
    cam.keyframe_insert("rotation_euler", frame=f)


periodic(cam_key)
smooth_all()

# ---------------------------------------------------------------- render
scene.render.engine = "CYCLES"
cy = scene.cycles
cy.device = "CPU"
cy.samples = SAMPLES
cy.use_adaptive_sampling = True
cy.adaptive_threshold = 0.04
cy.use_denoising = True
cy.denoiser = "OPENIMAGEDENOISE"
cy.max_bounces, cy.diffuse_bounces, cy.glossy_bounces = (12, 2, 4) if GLASS else (6, 3, 2)
cy.transmission_bounces, cy.transparent_max_bounces = (12, 4) if GLASS else (2, 2)
cy.caustics_reflective = False
cy.blur_glossy = 0.6
# No motion blur: the moves are slow, and blur costs more render time than it adds here.
scene.render.use_motion_blur = False
scene.render.resolution_x, scene.render.resolution_y = SIZE
scene.render.resolution_percentage = RES
scene.view_settings.view_transform = "Standard"
try:
    scene.view_settings.look = "None" if GLASS else "AgX - Base Contrast"
except TypeError:
    scene.view_settings.look = "None"
scene.view_settings.exposure = -0.1 if GLASS else -0.35
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_depth = "8"

if GLASS:
    scene.use_nodes = True
    nt = scene.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    rl = nt.nodes.new("CompositorNodeRLayers")
    glare = nt.nodes.new("CompositorNodeGlare")
    for attr, value in (("glare_type", "FOG_GLOW"), ("quality", "MEDIUM"), ("threshold", 0.9), ("size", 8), ("mix", -0.5)):
        try:
            setattr(glare, attr, value)
        except (AttributeError, TypeError):
            pass
    for sock, value in (("Threshold", 0.9), ("Size", 0.8), ("Strength", 0.5)):
        if sock in glare.inputs:
            glare.inputs[sock].default_value = value
    comp = nt.nodes.new("CompositorNodeComposite")
    nt.links.new(rl.outputs["Image"], glare.inputs["Image"])
    nt.links.new(glare.outputs["Image"], comp.inputs["Image"])

start, end = (int(x) for x in FRAMES.split("-"))
for f in range(start, end + 1):
    scene.frame_set(f)
    scene.render.filepath = f"{OUT}{f:04d}"
    bpy.ops.render.render(write_still=True)
