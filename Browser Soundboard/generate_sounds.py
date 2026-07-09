import wave
import math
import struct
import os
import random

def save_wav(filename, sample_rate, data):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with wave.open(filename, 'w') as w:
        w.setnchannels(1)  # Mono
        w.setsampwidth(2)  # 16-bit
        w.setframerate(sample_rate)
        packed = b''
        for sample in data:
            val = int(max(-32767, min(32767, sample * 32767)))
            packed += struct.pack('<h', val)
        w.writeframes(packed)

def generate_piano():
    sr = 44100
    duration = 1.5
    num_samples = int(sr * duration)
    data = []
    freq = 261.63 # Middle C
    for i in range(num_samples):
        t = i / sr
        envelope = math.exp(-3.0 * t)
        val = 0.6 * math.sin(2 * math.pi * freq * t) + \
              0.3 * math.sin(2 * math.pi * freq * 2 * t) + \
              0.1 * math.sin(2 * math.pi * freq * 3 * t)
        data.append(val * envelope)
    return sr, data

def generate_drum():
    sr = 44100
    duration = 0.5
    num_samples = int(sr * duration)
    data = []
    for i in range(num_samples):
        t = i / sr
        envelope = math.exp(-8.0 * t)
        freq = 150.0 * math.exp(-12.0 * t) + 40.0
        val = math.sin(2 * math.pi * freq * t)
        data.append(val * envelope)
    return sr, data

def generate_clap():
    sr = 44100
    duration = 0.4
    num_samples = int(sr * duration)
    data = []
    for i in range(num_samples):
        t = i / sr
        envelope = math.exp(-15.0 * t)
        if t < 0.05:
            envelope += 0.5 * math.exp(-30.0 * (t - 0.01)) * (1.0 if t > 0.01 else 0.0)
            envelope += 0.5 * math.exp(-30.0 * (t - 0.02)) * (1.0 if t > 0.02 else 0.0)
        noise = random.uniform(-1.0, 1.0)
        data.append(noise * envelope * 0.7)
    return sr, data

def generate_bell():
    sr = 44100
    duration = 2.0
    num_samples = int(sr * duration)
    data = []
    freqs = [523.25, 783.99, 987.77, 1174.66]
    weights = [0.5, 0.3, 0.15, 0.05]
    for i in range(num_samples):
        t = i / sr
        envelope = math.exp(-1.5 * t)
        val = sum(w * math.sin(2 * math.pi * f * t) for f, w in zip(freqs, weights))
        data.append(val * envelope)
    return sr, data

def generate_guitar():
    sr = 44100
    duration = 1.8
    num_samples = int(sr * duration)
    data = []
    freq = 196.00 # G3
    for i in range(num_samples):
        t = i / sr
        envelope = math.exp(-2.0 * t)
        val = 0.5 * math.sin(2 * math.pi * freq * t) + \
              0.3 * math.sin(2 * math.pi * freq * 2 * t + 0.5) + \
              0.15 * math.sin(2 * math.pi * freq * 3 * t + 1.0) + \
              0.05 * math.sin(2 * math.pi * freq * 4 * t + 1.5)
        val *= (1 + 0.05 * math.sin(2 * math.pi * 6 * t))
        data.append(val * envelope)
    return sr, data

def generate_rain():
    sr = 44100
    duration = 3.0
    num_samples = int(sr * duration)
    data = []
    y = 0
    for i in range(num_samples):
        noise = random.uniform(-1.0, 1.0)
        y = 0.9 * y + 0.1 * noise
        crackle = 0
        if random.random() < 0.005:
            crackle = random.uniform(-0.5, 0.5)
        data.append((y + crackle) * 0.3)
    return sr, data

def generate_thunder():
    sr = 44100
    duration = 3.0
    num_samples = int(sr * duration)
    data = []
    y = 0
    for i in range(num_samples):
        t = i / sr
        noise = random.uniform(-1.0, 1.0)
        y = 0.98 * y + 0.02 * noise
        envelope = math.exp(-0.5 * t) * (1.0 + 0.5 * math.sin(2 * math.pi * 0.5 * t))
        data.append(y * envelope * 0.8)
    return sr, data

def generate_bird():
    sr = 44100
    duration = 1.2
    num_samples = int(sr * duration)
    data = []
    for i in range(num_samples):
        t = i / sr
        chirp = math.sin(2 * math.pi * (1500 + 800 * math.sin(2 * math.pi * 5 * t)) * t)
        envelope = math.exp(-2.0 * t) * (0.5 + 0.5 * math.sin(2 * math.pi * 10 * t))
        data.append(chirp * envelope * 0.5)
    return sr, data

def generate_cat():
    sr = 44100
    duration = 1.5
    num_samples = int(sr * duration)
    data = []
    for i in range(num_samples):
        t = i / sr
        freq = 300 + 200 * math.sin(math.pi * t / duration)
        val = 0.4 * math.sin(2 * math.pi * freq * t) + \
              0.4 * math.sin(2 * math.pi * freq * 2 * t) + \
              0.2 * math.sin(2 * math.pi * freq * 3 * t)
        val *= (1 + 0.15 * math.sin(2 * math.pi * 8 * t))
        envelope = math.sin(math.pi * t / duration) ** 2
        data.append(val * envelope * 0.5)
    return sr, data

def generate_applause():
    sr = 44100
    duration = 3.0
    num_samples = int(sr * duration)
    data = []
    claps = [random.randint(0, num_samples - 1000) for _ in range(300)]
    clap_data = [0] * num_samples
    for start in claps:
        for idx in range(1000):
            if start + idx < num_samples:
                t = idx / sr
                val = random.uniform(-1.0, 1.0) * math.exp(-50.0 * t)
                clap_data[start + idx] += val * 0.05
    y = 0
    for i in range(num_samples):
        y = 0.7 * y + 0.3 * clap_data[i]
        data.append(max(-1.0, min(1.0, y)))
    return sr, data

def generate_laugh():
    sr = 44100
    duration = 2.0
    num_samples = int(sr * duration)
    data = []
    for i in range(num_samples):
        t = i / sr
        ha_env = abs(math.sin(2 * math.pi * 4 * t))
        freq = 220 + 30 * math.sin(2 * math.pi * 4 * t)
        val = 0.5 * math.sin(2 * math.pi * freq * t) + \
              0.3 * math.sin(2 * math.pi * freq * 2 * t) + \
              0.2 * math.sin(2 * math.pi * freq * 3 * t)
        envelope = math.exp(-1.0 * t) * ha_env
        data.append(val * envelope * 0.6)
    return sr, data

def generate_horn():
    sr = 44100
    duration = 1.0
    num_samples = int(sr * duration)
    data = []
    for i in range(num_samples):
        t = i / sr
        freq1 = 293.66
        freq2 = 349.23
        val1 = 1.0 if math.sin(2 * math.pi * freq1 * t) > 0 else -1.0
        val2 = 1.0 if math.sin(2 * math.pi * freq2 * t) > 0 else -1.0
        val = 0.5 * val1 + 0.5 * val2
        envelope = math.sin(math.pi * t / duration) ** 0.5
        data.append(val * envelope * 0.4)
    return sr, data

def main():
    sounds = {
        'piano.mp3': generate_piano,
        'drum.mp3': generate_drum,
        'clap.mp3': generate_clap,
        'bell.mp3': generate_bell,
        'guitar.mp3': generate_guitar,
        'rain.mp3': generate_rain,
        'thunder.mp3': generate_thunder,
        'bird.mp3': generate_bird,
        'cat.mp3': generate_cat,
        'applause.mp3': generate_applause,
        'laugh.mp3': generate_laugh,
        'horn.mp3': generate_horn,
    }
    
    out_dir = r"d:\Browser Soundboard\assets\sounds"
    print(f"Generating sounds in {out_dir}...")
    for filename, generator in sounds.items():
        filepath = os.path.join(out_dir, filename)
        sr, data = generator()
        save_wav(filepath, sr, data)
        print(f"Generated {filename}")

if __name__ == '__main__':
    main()
