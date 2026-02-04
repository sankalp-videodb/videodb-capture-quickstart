try:
    import pycloudflared

    print(f"Module: {pycloudflared}")
    print(f"Dir: {dir(pycloudflared)}")
except ImportError as e:
    print(f"ImportError: {e}")
