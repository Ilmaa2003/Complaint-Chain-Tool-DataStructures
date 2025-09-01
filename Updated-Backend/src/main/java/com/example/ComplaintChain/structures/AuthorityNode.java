package com.example.ComplaintChain.structures;

import com.example.ComplaintChain.entity.Authority;

public class AuthorityNode {
    private Authority authority;
    private int currentWorkload; // number of complaints currently assigned

    public AuthorityNode(Authority authority) {
        this.authority = authority;
        this.currentWorkload = 0;
    }

    public Authority getAuthority() {
        return authority;
    }

    public int getCurrentWorkload() {
        return currentWorkload;
    }

    public void incrementWorkload() {
        this.currentWorkload++;
    }

    public void decrementWorkload() {
        if(this.currentWorkload > 0) this.currentWorkload--;
    }
}
