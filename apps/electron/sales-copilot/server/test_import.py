try:
    import cloudflared

    print(f"Cloudflared path: {cloudflared.BINARY_PATH}")
except ImportError as e:
    print(f"ImportError: {e}")
except Exception as e:
    print(f"Error: {e}")
