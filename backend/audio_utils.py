import librosa
import numpy as np

def analyze_audio_features(file_path):
    """
    Extracts audio features using librosa:
    - MFCC (Mel-frequency cepstral coefficients)
    - Pitch (Fundamental frequency F0)
    - Spectral Centroid
    """
    try:
        # Load audio (downsample to 16kHz for consistency)
        y, sr = librosa.load(file_path, sr=16000)
        
        # 1. MFCC
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        mfcc_mean = np.mean(mfccs)
        mfcc_var = np.var(mfccs)
        
        # 2. Pitch (F0) using piptrack
        pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
        # Select pitches with high magnitude
        pitches = pitches[magnitudes > np.median(magnitudes)]
        pitches = pitches[pitches > 0] # Remove zeros
        
        pitch_std = 0
        if len(pitches) > 0:
            pitch_std = np.std(pitches)
        
        # 3. Spectral Centroid
        spectral_centroids = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
        centroid_var = np.var(spectral_centroids)
        
        return {
            "mfcc_var": float(mfcc_var),
            "pitch_std": float(pitch_std),
            "centroid_var": float(centroid_var)
        }
        
    except Exception as e:
        print(f"Feature extraction failed: {e}")
        raise e
