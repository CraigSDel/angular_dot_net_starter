namespace my_new_app.Service;

public sealed class InvalidReferenceException(string message) : Exception(message);
