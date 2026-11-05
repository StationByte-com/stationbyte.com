"""StationByte hero film: path-traced glass tile grid (Blender Cycles).

Render (from the repo root):
  /Applications/Blender.app/Contents/MacOS/Blender -b -P scripts/hero-film/scene.py -- \
      --out .render/film/f --frames 1-192 [--samples 64] [--res 100]
Then encode with scripts/hero-film/encode.sh.

The loop is 8 s at 24 fps (192 frames). Every animated value is periodic or returns home,
so frame 193 equals frame 1 and the film loops without a cut.
"""

import math
import sys

import bpy
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []


def arg(name, default):
    return argv[argv.index(f"--{name}") + 1] if f"--{name}" in argv else default


OUT = arg("out", "//render/f")
FRAMES = arg("frames", "1-192")
SAMPLES = int(arg("samples", "64"))
RES = int(arg("res", "100"))
FPS = 24
LOOP = 192
STEP = 1.22  # tile pitch: 1.0 tile + 0.22 gap

# ---------------------------------------------------------------- reset
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


# ---------------------------------------------------------------- materials
glass, _ = principled(
    "Frosted glass",
    **{"Base Color": hex_rgba("#f2f4ff"), "Transmission Weight": 1.0, "Roughness": 0.09, "IOR": 1.5,
       "Coat Weight": 0.6, "Coat Roughness": 0.06},
)
graphite, _ = principled(
    "Graphite",
    **{"Base Color": hex_rgba("#1b1b20"), "Metallic": 0.7, "Roughness": 0.42, "Coat Weight": 1.0,
       "Coat Roughness": 0.08},
)
core, core_bsdf = principled(
    "Signal core",
    **{"Base Color": hex_rgba("#2438e6"), "Roughness": 0.35, "Emission Color": hex_rgba("#3046ff"),
       "Emission Strength": 1.4, "Coat Weight": 0.5, "Coat Roughness": 0.1},
)
floor_mat, _ = principled(
    "Floor",
    **{"Base Color": hex_rgba("#050506"), "Roughness": 0.16, "Specular IOR Level": 0.6},
)

# ---------------------------------------------------------------- tiles
GLASS_SLOTS = {(0, 0), (0, 2), (1, 0), (2, 0)}
grid = bpy.data.objects.new("Grid", None)
scene.collection.objects.link(grid)
grid.rotation_euler = (0, 0, math.radians(-8))
grid.location = (0, 0, 0)
tiles = {}
for r in range(3):
    for c in range(3):
        if (r, c) == (2, 2):
            continue  # the open slot
        bpy.ops.mesh.primitive_cube_add(size=1)
        t = bpy.context.active_object
        t.name = f"tile-{r}{c}"
        t.scale = (1.0, 0.42, 1.0)  # unit cube -> 1.0 wide, 0.42 deep, 1.0 tall (standing upright, facing -Y)
        bpy.ops.object.transform_apply(scale=True)
        bev = t.modifiers.new("Bevel", "BEVEL")
        bev.width, bev.segments, bev.limit_method = 0.16, 10, "NONE"
        bpy.ops.object.shade_smooth()
        t.data.materials.append(core if (r, c) == (1, 1) else glass if (r, c) in GLASS_SLOTS else graphite)
        t.location = ((c - 1) * STEP, 0, (1 - r) * STEP + 1.72)
        t.parent = grid
        tiles[(r, c)] = t

# One puzzle move out (frames 49-73) and back (frames 133-157): the loop closes on frame 1.
mover = tiles[(2, 1)]
home = mover.location.copy()
for f, dx, dy in [(1, 0, 0), (49, 0, 0), (61, 0.5, -0.32), (73, 1, 0), (133, 1, 0), (145, 0.5, -0.32), (157, 0, 0), (LOOP + 1, 0, 0)]:
    mover.location = home + Vector((dx * STEP, dy, 0))
    mover.keyframe_insert("location", frame=f)
for fc in mover.animation_data.action.fcurves:
    for k in fc.keyframe_points:
        k.interpolation = "BEZIER"
        k.easing = "AUTO"

# Core breathes twice per loop.
for i, f in enumerate(range(1, LOOP + 2, LOOP // 4)):
    core_bsdf.inputs["Emission Strength"].default_value = 1.2 if i % 2 == 0 else 1.8
    core_bsdf.inputs["Emission Strength"].keyframe_insert("default_value", frame=f)

# ---------------------------------------------------------------- floor and world
bpy.ops.mesh.primitive_plane_add(size=80, location=(0, 0, 0))
bpy.context.active_object.data.materials.append(floor_mat)

world = bpy.data.worlds.new("World")
scene.world = world
world.use_nodes = True
world.node_tree.nodes["Background"].inputs["Color"].default_value = hex_rgba("#020203")
world.node_tree.nodes["Background"].inputs["Strength"].default_value = 1.0


def area(name, loc, rot, size, energy, color="#ffffff", shape="RECTANGLE", size_y=None, camera=False, glossy=True):
    data = bpy.data.lights.new(name, "AREA")
    data.shape = shape
    data.size = size
    if size_y is not None:
        data.size_y = size_y
    data.energy = energy
    data.color = hex_rgba(color)[:3]
    obj = bpy.data.objects.new(name, data)
    obj.location, obj.rotation_euler = loc, rot
    obj.visible_camera = camera
    obj.visible_glossy = glossy
    scene.collection.objects.link(obj)
    return obj


def aim(obj, target):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat("-Z", "Y").to_euler()


center = Vector((0, 0, 1.72))
key = area("Key softbox", (-5.5, -5.0, 6.0), (0, 0, 0), 7.0, 300, size_y=4.0)
aim(key, center)
rim = area("Rim strip", (6.0, 4.0, 3.6), (0, 0, 0), 0.5, 220, "#a9b4ff", size_y=6.0)
aim(rim, center)
# The rim only lights the tiles, so its strip never shows up reflected in the floor.
tile_set = bpy.data.collections.new("Rim receivers")
for t in tiles.values():
    tile_set.objects.link(t)
rim.light_linking.receiver_collection = tile_set
back = area("Backlight", (2.6, 5.5, 3.2), (0, 0, 0), 7.0, 45, "#dfe5ff", size_y=4.0, glossy=False)
aim(back, center)
top = area("Top fill", (0, -1.0, 7.5), (0, 0, 0), 6.0, 50, glossy=False)
aim(top, center)

# A narrow strip that crosses the set once per loop, sweeping a highlight over the glass.
sweep = area("Sweep", (-9, -6, 3.0), (0, 0, 0), 0.25, 450, size_y=7.0)
for f, x in [(1, -9.0), (LOOP + 1, 9.0)]:
    sweep.location.x = x
    aim(sweep, center)
    sweep.keyframe_insert("location", frame=f)
    sweep.keyframe_insert("rotation_euler", frame=f)
for fc in sweep.animation_data.action.fcurves:
    for k in fc.keyframe_points:
        k.interpolation = "LINEAR"
# It starts and ends at opposite sides, so it fades in and out to keep the loop seam invisible.
for f, e in [(1, 0), (33, 450), (LOOP - 31, 450), (LOOP + 1, 0)]:
    sweep.data.energy = e
    sweep.data.keyframe_insert("energy", frame=f)

# Blue spill from the core onto the floor and neighbours.
spill_data = bpy.data.lights.new("Core spill", "POINT")
spill_data.energy, spill_data.color, spill_data.shadow_soft_size = 60, hex_rgba("#3046ff")[:3], 0.5
spill = bpy.data.objects.new("Core spill", spill_data)
spill.location = (0, 0.55, 1.72)
scene.collection.objects.link(spill)

# ---------------------------------------------------------------- camera
cam_data = bpy.data.cameras.new("Camera")
cam_data.lens = 58
cam_data.dof.use_dof = True
cam_data.dof.aperture_fstop = 2.2
cam = bpy.data.objects.new("Camera", cam_data)
scene.collection.objects.link(cam)
scene.camera = cam
focus = bpy.data.objects.new("Focus", None)
focus.location = (0.1, 0, 1.72)
scene.collection.objects.link(focus)
cam_data.dof.focus_object = focus
look = bpy.data.objects.new("Look", None)
scene.collection.objects.link(look)
track = cam.constraints.new("TRACK_TO")
track.target, track.track_axis, track.up_axis = look, "TRACK_NEGATIVE_Z", "UP_Y"

# Slow periodic orbit and dolly: sampled every 8 frames so the curve is smooth and closes on itself.
for f in range(1, LOOP + 2, 8):
    k = (f - 1) / LOOP * 2 * math.pi
    yaw = math.radians(-41 + 5 * math.sin(k))
    dist = 13.9 - 0.6 * (1 - math.cos(k)) / 2
    cam.location = (math.sin(yaw) * dist, -math.cos(yaw) * dist, 1.15 + 0.25 * math.sin(k + 0.6))
    cam.keyframe_insert("location", frame=f)
    # Aim left of the grid so it sits in the right half of a 16:9 frame.
    look.location = (-1.9, 0, 1.45 + 0.05 * math.sin(k))
    look.keyframe_insert("location", frame=f)

# ---------------------------------------------------------------- render settings
scene.render.engine = "CYCLES"
cy = scene.cycles
cy.device = "CPU"
cy.samples = SAMPLES
cy.use_adaptive_sampling = True
cy.adaptive_threshold = 0.02
cy.use_denoising = True
cy.denoiser = "OPENIMAGEDENOISE"
cy.max_bounces, cy.diffuse_bounces, cy.glossy_bounces = 10, 2, 4
cy.transmission_bounces, cy.transparent_max_bounces = 10, 4
cy.caustics_reflective = False
cy.blur_glossy = 0.6
scene.render.use_motion_blur = True
scene.render.motion_blur_shutter = 0.45
scene.render.resolution_x, scene.render.resolution_y = 1920, 1080
scene.render.resolution_percentage = RES
scene.render.film_transparent = False
scene.view_settings.view_transform = "Standard"
scene.view_settings.look = "None"
scene.view_settings.exposure = -0.15
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_depth = "8"
scene.render.filepath = OUT

# ---------------------------------------------------------------- compositor: glow and a touch of dispersion
scene.use_nodes = True
nt = scene.node_tree
for n in list(nt.nodes):
    nt.nodes.remove(n)
rl = nt.nodes.new("CompositorNodeRLayers")
glare = nt.nodes.new("CompositorNodeGlare")
for attr, value in (("glare_type", "FOG_GLOW"), ("quality", "HIGH"), ("threshold", 0.9), ("size", 8), ("mix", -0.55)):
    try:
        setattr(glare, attr, value)
    except (AttributeError, TypeError):
        pass
for sock, value in (("Threshold", 0.9), ("Size", 0.8), ("Strength", 0.45)):
    if sock in glare.inputs:
        glare.inputs[sock].default_value = value
lens = nt.nodes.new("CompositorNodeLensdist")
if "Dispersion" in lens.inputs:
    lens.inputs["Dispersion"].default_value = 0.012
if "Distortion" in lens.inputs:
    lens.inputs["Distortion"].default_value = -0.008
out = nt.nodes.new("CompositorNodeComposite")
nt.links.new(rl.outputs["Image"], glare.inputs["Image"])
nt.links.new(glare.outputs["Image"], lens.inputs["Image"])
nt.links.new(lens.outputs["Image"], out.inputs["Image"])

# ---------------------------------------------------------------- render
start, end = (int(x) for x in FRAMES.split("-"))
for f in range(start, end + 1):
    scene.frame_set(f)
    scene.render.filepath = f"{OUT}{f:04d}"
    bpy.ops.render.render(write_still=True)
